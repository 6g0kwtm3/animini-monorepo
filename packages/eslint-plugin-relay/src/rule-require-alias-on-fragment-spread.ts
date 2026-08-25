import type { Rule } from "eslint"

import { Kind, OperationTypeNode, visit, type DocumentNode } from "graphql"
import {
	getGraphQLAST,
	getLoc,
	hasPrecedingEslintDisableComment,
	isGraphQLTemplate,
	type GraphqlTemplateExpression,
	type NodeWithLoc,
} from "./utils"

const ESLINT_DISABLE_COMMENT =
	" eslint-disable-next-line eslint-plugin-relay/require-alias-on-fragment-spread"

interface NodeWithLocAndName extends NodeWithLoc {
	name: string
}

function getFragmentSpreadsWithoutAlias(graphQLAst: DocumentNode) {
	const spreads: NodeWithLocAndName[] = []

	visit(graphQLAst, {
		FragmentSpread(node, _key, _parent, _path, ancestors) {
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

			const hasAlias = (node.directives ?? []).some(
				(d) => d.name.value === "alias"
			)

			if (hasAlias) {
				return
			}

			if (hasPrecedingEslintDisableComment(node, ESLINT_DISABLE_COMMENT)) {
				return
			}

			if (!node.loc) {
				return
			}

			if (
				node.name.value.endsWith("_assignable")
				|| node.name.value.endsWith("_plural")
			) {
				return
			}

			spreads.push({ loc: node.loc, name: node.name.value })
		},
	})

	return spreads
}

export const rule: Rule.RuleModule = {
	meta: {
		type: "suggestion",
		docs: {},
		schema: [],
		fixable: "code",
		messages: {
			"require-alias-on-fragment-spread": `Fragment spread \`...{{ fragment }}\` is missing the \`@alias\` directive.`,
		},
	},
	create(context) {
		const templateLiterals: {
			graphQLAst: DocumentNode
			node: GraphqlTemplateExpression
		}[] = []

		return {
			TaggedTemplateExpression(node) {
				if (isGraphQLTemplate(node)) {
					const graphQLAst = getGraphQLAST(node)
					if (!graphQLAst) {
						return
					}
					templateLiterals.push({ node, graphQLAst })
				}
			},
			"Program:exit"() {
				for (const { node, graphQLAst } of templateLiterals) {
					const spreadsWithoutAlias = getFragmentSpreadsWithoutAlias(graphQLAst)
					for (const fragment of spreadsWithoutAlias) {
						context.report({
							node,
							messageId: "require-alias-on-fragment-spread",
							loc: getLoc(context, node, fragment),
							data: { fragment: fragment.name },
							fix(fixer) {
								const range = getEndRange(node, fragment)
								return fixer.insertTextAfterRange(range, " @alias")
							},
						})
					}
				}
			},
		}
	},
}

function getEndRange(
	templateNode: GraphqlTemplateExpression,
	graphQLNode: NodeWithLoc
): [number, number] {
	const graphQLStart = templateNode.quasi.quasis[0].range[0] + 1
	const end = graphQLStart + graphQLNode.loc.end
	return [end, end]
}

function isReadonlyArray(value: unknown): value is readonly unknown[] {
	return Array.isArray(value)
}
