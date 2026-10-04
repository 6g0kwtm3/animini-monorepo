import type { GraphQLESLintRule } from "@graphql-eslint/eslint-plugin"
import { OperationTypeNode } from "graphql"

export const rule: GraphQLESLintRule = {
	meta: {
		type: "suggestion",
		schema: [],
		fixable: "code",
		messages: {
			"require-throw-on-field-error-on-fragment-definition": `Fragment definition \`...{{ fragment }}\` is missing the \`@throwOnFieldError\` directive.`,
		},
	},
	create(context) {
		return {
			OperationDefinition(node) {
				if (
					node.operation === OperationTypeNode.MUTATION
					|| node.operation === OperationTypeNode.SUBSCRIPTION
				) {
					return
				}

				if (
					node.directives?.some(
						(d) =>
							d.name.value === "throwOnFieldError"
							|| d.name.value === "assignable"
							|| d.name.value === "updatable"
					)
				) {
					return
				}

				context.report({
					node: node,
					messageId: "require-throw-on-field-error-on-fragment-definition",
					data: { fragment: node.name.value },
					fix(fixer) {
						return fixer.insertTextAfter(
							node.typeCondition,
							" @throwOnFieldError"
						)
					},
				})
			},
			FragmentDefinition(node) {
				if (
					node.directives?.some(
						(d) =>
							d.name.value === "throwOnFieldError"
							|| d.name.value === "assignable"
							|| d.name.value === "updatable"
					)
				) {
					return
				}

				context.report({
					node: node,
					messageId: "require-throw-on-field-error-on-fragment-definition",
					data: { fragment: node.name.value },
					fix(fixer) {
						return fixer.insertTextAfter(
							node.typeCondition,
							" @throwOnFieldError"
						)
					},
				})
			},
		}
	},
}
