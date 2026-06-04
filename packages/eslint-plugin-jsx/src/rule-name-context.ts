import type { Rule } from "eslint"
import type * as ESTree from "estree"

export const rule: Rule.RuleModule = {
	meta: {
		type: "suggestion",
		docs: { description: "" },
		schema: [],
		messages: { "name-context": "{{ context }} missing displayName" },
		fixable: "code",
	},
	create(context) {
		const declarations = new Map<string, ESTree.VariableDeclaration>()

		return {
			VariableDeclaration(node) {
				for (const subnode of node.declarations) {
					if (
						subnode.id.type === "Identifier"
						&& subnode.init?.type === "CallExpression"
						&& subnode.init.callee.type === "Identifier"
						&& subnode.init.callee.name === "createContext"
					) {
						declarations.set(subnode.id.name, node)
					}
				}
			},
			AssignmentExpression(node) {
				if (
					node.left.type === "MemberExpression"
					&& node.left.object.type === "Identifier"
					&& node.left.property.type === "Identifier"
					&& node.left.property.name === "displayName"
				) {
					declarations.delete(node.left.object.name)
				}
			},
			"Program:exit"() {
				for (const [name, declaration] of declarations) {
					context.report({
						node: declaration,
						messageId: "name-context",
						data: { context: name },
						fix(fixer) {
							return fixer.insertTextAfter(
								declaration,
								`\n${name}.displayName = "${name}"`
							)
						},
					})
				}
			},
		}
	},
}
