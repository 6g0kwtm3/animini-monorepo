import type { GraphQLESLintRule } from "@graphql-eslint/eslint-plugin"
import { OperationTypeNode } from "graphql"

export const rule: GraphQLESLintRule = {
	meta: {
		type: "suggestion",
		schema: [],
		fixable: "code",
		messages: {
			"require-raw-response-type-on-operation-definition": `{{ type }} \`{{ name }}\` is missing the \`@raw_response_type\` directive.`,
		},
	},
	create(context) {
		return {
			OperationDefinition(node) {
				if (
					node.directives?.some((d) => d.name.value === "raw_response_type")
				) {
					return
				}

				if (node.name == null) {
					// compiler error
					return
				}

				context.report({
					node: node,
					messageId: "require-raw-response-type-on-operation-definition",
					data: {
						name: node.name.value,
						type: {
							[OperationTypeNode.QUERY]: "Query",
							[OperationTypeNode.MUTATION]: "Mutation",
							[OperationTypeNode.SUBSCRIPTION]: "Subscription",
						}[node.operation],
					},
					fix(fixer) {
						return fixer.insertTextBefore(
							node.selectionSet,
							"@raw_response_type "
						)
					},
				})
			},
		}
	},
}
