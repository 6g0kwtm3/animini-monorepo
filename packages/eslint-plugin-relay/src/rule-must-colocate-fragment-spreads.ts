/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of thttps://github.com/relayjs/eslint-plugin-relay.
 *
 * This rule lints for non-colocated fragment spreads within queries or
 * fragments. In other words, situations where a fragment is spread in module A,
 * but the module (B) that defines that fragment is not imported by module A.
 * It does not lint subscriptions or mutations. This catches:
 *
 * - The anti-pattern of spreading a fragment in a parent module, then passing
 * that data down to a child module, or jamming it all in context. This defeats
 * the purpose of Relay. From the
 * [Relay docs](https://relay.dev/docs/next) – "[Relay]
 * allows components to specify what data they need and the Relay framework
 * provides the data. This makes the data needs of inner components opaque and
 * allows composition of those needs."
 * - Instances where fragment spreads are unused, which results in overfetching.
 *
 * ## When the fragment is unused
 * The easiest way to tell if a fragment is unused is to remove the line
 * containing the lint error, run Relay compiler, then Flow. If there are no
 * type errors, then the fragment was possibly unused. You should still test
 * your functionality to see that it's working as expected.
 *
 * ## When the fragment is being passed to a child component
 * If you received Relay or Flow errors after attempting to remove the fragment,
 * then it's very likely that you're passing that data down the tree. Our
 * recommendation is to have components specify the data they need. In the below
 * example, this is an anti-pattern because Component B's data requirements are
 * no longer opaque. Component B should not be fetching data on Component C's
 * behalf.
 *
 * function ComponentA(props) {
 *   const data = useFragment(graphql`
 *     fragment ComponentA_fragment on User {
 *       foo
 *       bar
 *       some_field {
 *         ...ComponentC_fragment
 *       }
 *     }
 *   `);
 *   return (
 *     <div>
 *       {data.foo} {data.baz}
 *       <ComponentB text="Hello" data={data.some_field} />
 *     </div>
 *   );
 * }
 *
 * To address this, refactor Component C to fetch the data it needs. You'll need
 * to update the intermediate components by amending, or adding a fragment to
 * each intermediate component between ComponentA and ComponentC.
 */

"use strict"

import type { Rule } from "eslint"
import {
	BREAK,
	Kind,
	OperationTypeNode,
	visit,
	type DocumentNode,
	type FragmentSpreadNode,
} from "graphql"
import {
	getGraphQLAST,
	getLoc,
	getModuleName,
	hasPrecedingEslintDisableComment,
	isGraphQLTemplate,
	type GraphqlTemplateExpression,
} from "./utils"

const ESLINT_DISABLE_COMMENT =
	" eslint-disable-next-line eslint-plugin-relay/must-colocate-fragment-spreads"

function isReadonlyArray(value: unknown): value is readonly unknown[] {
	return Array.isArray(value)
}

function getGraphQLFragmentSpreads(graphQLAst: DocumentNode) {
	const fragmentSpreads: Record<string, FragmentSpreadNode> = {}
	visit(graphQLAst, {
		FragmentSpread(node, key, parent, path, ancestors) {
			for (const ancestorNode of ancestors) {
				if (isReadonlyArray(ancestorNode)) {
					continue
				}
				if (
					ancestorNode.kind === Kind.OPERATION_DEFINITION
					&& (ancestorNode.operation === OperationTypeNode.MUTATION
						|| ancestorNode.operation === OperationTypeNode.SUBSCRIPTION)
				) {
					return
				}
			}
			for (const directiveNode of node.directives ?? []) {
				if (directiveNode.name.value === "module") {
					return
				}
				if (directiveNode.name.value === "relay") {
					for (const argumentNode of directiveNode.arguments ?? []) {
						if (
							argumentNode.name.value === "mask"
							&& "value" in argumentNode.value
							&& argumentNode.value.value === false
						) {
							return
						}
					}
				}
			}
			if (hasPrecedingEslintDisableComment(node, ESLINT_DISABLE_COMMENT)) {
				return
			}
			fragmentSpreads[node.name.value] = node
		},
	})
	return fragmentSpreads
}

function getGraphQLFragmentDefinitionName(
	graphQLAst: DocumentNode
): string | null {
	let name: string | null = null
	visit(graphQLAst, {
		FragmentDefinition(node) {
			name = node.name.value
			return BREAK
		},
	})
	return name
}

export const rule: Rule.RuleModule = {
	meta: {
		docs: {},
		schema: [],
		messages: {
			"must-colocate-fragment-spreads":
				`This spreads the fragment \`{{ fragment }}\` but `
				+ "this module does not use it directly.",
		},
	},
	create(context) {
		const foundImportedModules: string[] = []
		const graphqlLiterals: {
			node: GraphqlTemplateExpression
			graphQLAst: DocumentNode
		}[] = []

		return {
			"Program:exit"(_node) {
				const fragmentsInTheSameModule = new Set<string>()
				graphqlLiterals.forEach(({ graphQLAst }) => {
					const fragmentName = getGraphQLFragmentDefinitionName(graphQLAst)
					if (fragmentName) {
						fragmentsInTheSameModule.add(fragmentName)
					}
				})
				graphqlLiterals.forEach(({ node, graphQLAst }) => {
					const queriedFragments = getGraphQLFragmentSpreads(graphQLAst)
					for (const fragment in queriedFragments) {
						const matchedModuleName = foundImportedModules.find((name) =>
							fragment.startsWith(name)
						)
						if (
							queriedFragments[fragment]
							&& !matchedModuleName
							&& !fragmentsInTheSameModule.has(fragment)
						) {
							context.report({
								node,
								messageId: "must-colocate-fragment-spreads",
								loc: getLoc(context, node, queriedFragments[fragment]),
								data: { fragment },
							})
						}
					}
				})
			},

			ImportDeclaration(node) {
				if (
					"importKind" in node
					&& node.importKind === "value"
					&& typeof node.source.value === "string"
				) {
					foundImportedModules.push(getModuleName(node.source.value))
				}
			},

			ImportExpression(node) {
				if (
					node.source.type === "Literal"
					&& typeof node.source.value === "string"
				) {
					// Allow dynamic imports like import(`test/${fileName}`); and (path) => import(path);
					// These would have node.source.value undefined
					foundImportedModules.push(getModuleName(node.source.value))
				}
			},

			CallExpression(node) {
				if ("name" in node.callee && node.callee.name !== "require") {
					return
				}
				const [source] = node.arguments
				if (
					source
					&& source.type === "Literal"
					&& typeof source.value === "string"
				) {
					foundImportedModules.push(getModuleName(source.value))
				}
			},

			TaggedTemplateExpression(node) {
				if (isGraphQLTemplate(node)) {
					const graphQLAst = getGraphQLAST(node)
					if (!graphQLAst) {
						// ignore nodes with syntax errors, they're handled by rule-graphql-syntax
						return
					}
					graphqlLiterals.push({ node, graphQLAst })
				}
			},
		}
	},
}
