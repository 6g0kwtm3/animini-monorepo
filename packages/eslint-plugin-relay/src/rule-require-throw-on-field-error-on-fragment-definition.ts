import type { GraphQLESLintRule } from "@graphql-eslint/eslint-plugin"

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
