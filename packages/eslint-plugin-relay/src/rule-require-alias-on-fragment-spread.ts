import type {
	GraphQLESLintRule,
	GraphQLESTreeNode,
} from "@graphql-eslint/eslint-plugin"
import {
	Kind,
	OperationTypeNode,
	type FragmentSpreadNode,
	type OperationDefinitionNode,
} from "graphql"

export const rule: GraphQLESLintRule = {
	meta: {
		type: "suggestion",
		schema: [],
		fixable: "code",
		messages: {
			"require-alias-on-fragment-spread": `Fragment spread \`...{{ fragment }}\` is missing the \`@alias\` directive.`,
		},
	},
	create(context) {
		const spreadsWithoutAlias: GraphQLESTreeNode<FragmentSpreadNode>[] = []

		let ancestorNode: GraphQLESTreeNode<OperationDefinitionNode> | null = null
		return {
			OperationDefinition(node) {
				ancestorNode = node
			},
			"OperationDefinition:exit"() {
				ancestorNode = null
			},
			FragmentSpread(node) {
				if (
					ancestorNode?.kind === Kind.OPERATION_DEFINITION
					&& (ancestorNode?.operation === OperationTypeNode.MUTATION
						|| ancestorNode?.operation === OperationTypeNode.SUBSCRIPTION)
				) {
					return
				}

				const hasAlias = (node.directives ?? []).some(
					(d) => d.name.value === "alias"
				)

				if (hasAlias) {
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

				spreadsWithoutAlias.push(node)
			},
			"Program:exit"() {
				for (const fragment of spreadsWithoutAlias) {
					context.report({
						node: fragment,
						messageId: "require-alias-on-fragment-spread",
						data: { fragment: fragment.name.value },
						fix(fixer) {
							return fixer.insertTextAfter(fragment, " @alias")
						},
					})
				}
			},
		}
	},
}
