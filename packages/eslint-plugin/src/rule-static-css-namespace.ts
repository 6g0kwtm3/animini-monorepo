import { defineRule, type ESTree } from "oxlint"

export const rule = defineRule({
	meta: { type: "problem" },
	createOnce(context) {
		let shouldStatic: number
		return {
			before() {
				shouldStatic = 0
			},
			"VariableDeclarator:exit"(node) {
				if (node.id.type === "Identifier" && node.id.name.startsWith("$")) {
					shouldStatic--
				}
			},
			VariableDeclarator(node) {
				if (node.id.type === "Identifier" && node.id.name.startsWith("$")) {
					shouldStatic++
				}
			},
			"CallExpression:exit"(node) {
				if (
					node.callee.type === "Identifier"
					&& node.callee.name.startsWith("$")
				) {
					shouldStatic--
				}
			},
			CallExpression(node) {
				if (
					node.callee.type === "Identifier"
					&& node.callee.name.startsWith("$")
				) {
					shouldStatic++
				}
			},
			Identifier(node) {
				if (
					shouldStatic
					&& node.parent.type !== "Property"
					&& node.parent.type !== "MemberExpression"
					&& !node.name.startsWith("$")
				) {
					context.report({
						node,
						message: "CSS class names must be static when using the $ prefix",
					})
				}
			},
			"JSXAttribute:exit"(node) {
				if (
					node.name.type === "JSXIdentifier"
					&& node.name.name.startsWith("$")
				) {
					shouldStatic--
				}
			},
			JSXAttribute(node) {
				if (
					node.name.type === "JSXIdentifier"
					&& node.name.name.startsWith("$")
				) {
					shouldStatic++
				}
			},
			MemberExpression(node) {
				if (shouldStatic) {
					const lastMember = lastMemberExpression(node)
					if (
						(lastMember.object.type !== "Identifier"
							|| !lastMember.object.name.startsWith("$"))
						&& (lastMember.property.type !== "Identifier"
							|| !lastMember.property.name.startsWith("$"))
					) {
						context.report({
							node,
							message: "CSS class names must be static when using the $ prefix",
						})
					}
				}
			},
		}
	},
})

function lastMemberExpression(
	node: ESTree.MemberExpression
): ESTree.MemberExpression {
	if (node.object.type === "MemberExpression") {
		return lastMemberExpression(node.object)
	}
	return node
}
