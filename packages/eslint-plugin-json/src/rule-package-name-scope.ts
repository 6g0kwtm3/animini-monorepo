import type { JSONRuleDefinition, JSONRuleVisitor } from "@eslint/json"

const SCOPE = "@animedes"

export const rule: JSONRuleDefinition<{
	MessageIds: "foreignScope" | "missingScope"
}> = {
	meta: {
		type: "suggestion",
		fixable: "code",
		messages: {
			foreignScope:
				'Package name "{{ name }}" must use the `@animedes/` scope.',
			missingScope:
				'Package name "{{ name }}" is missing the `@animedes/` scope; expected `@animedes/{{ name }}`.',
		},
	},
	create(context) {
		return {
			Object(node, parent) {
				if (parent?.type !== "Document") {
					return
				}

				const nameField = node.members.find(
					(member) =>
						member.name.type === "String" && member.name.value === "name"
				)?.value

				if (nameField?.type !== "String") {
					return
				}

				if (nameField.value.startsWith(`${SCOPE}/`)) {
					return
				}

				const foreignScope = nameField.value.startsWith("@")

				context.report({
					loc: nameField.loc,
					messageId: foreignScope ? "foreignScope" : "missingScope",
					data: { name: nameField.value },
					fix(fixer) {
						if (foreignScope) {
							return null
						}

						return fixer.replaceText(
							nameField,
							JSON.stringify(`${SCOPE}/${nameField.value}`)
						)
					},
				})
			},
		} satisfies JSONRuleVisitor
	},
}
