import {
	type TSESTree,
	AST_NODE_TYPES,
} from "@typescript-eslint/typescript-estree"
import { ASTUtils } from "@typescript-eslint/utils"
import type { Rule } from "eslint"

export const rule: Rule.RuleModule = {
	meta: {
		docs: {},
		schema: [],
		messages: {
			"must-include-data-key":
				"JSX element with 'key' prop must also have a matching 'data-key' prop.",
			"data-key-must-match-key":
				"The 'data-key' prop value must match the 'key' prop value.",
		},
		fixable: "code",
	},
	create(context) {
		return {
			JSXOpeningElement(node: TSESTree.JSXOpeningElement) {
				const byName = Object.fromEntries(
					node.attributes.flatMap(
						(attribute): [string, TSESTree.JSXAttribute][] => {
							switch (attribute.type) {
								case AST_NODE_TYPES.JSXAttribute:
									return [
										[
											(attribute.name.type === AST_NODE_TYPES.JSXIdentifier
												? attribute.name
												: attribute.name.name
											).name,
											attribute,
										],
									]
								case AST_NODE_TYPES.JSXSpreadAttribute:
									return []
								default:
									attribute satisfies never
									throw new Error("unreachable")
							}
						}
					)
				)

				const key = byName.key

				if (!key?.value) {
					return
				}

				const dataKey = byName["data-key"]

				if (!dataKey) {
					context.report({
						node,
						messageId: "must-include-data-key",
						data: {},
						fix(fixer) {
							return fixer.insertTextAfter(
								key,
								` data-key=${context.sourceCode.getText(key.value)}`
							)
						},
					}); return;
				}

				if (!isEqual(context, key.value, dataKey.value)) {
					context.report({
						node: dataKey,
						messageId: "data-key-must-match-key",
						data: {},
						fix(fixer) {
							return fixer.replaceText(
								dataKey.value,
								context.sourceCode.getText(key.value)
							)
						},
					})
				}
			},
		}
	},
}

function isEqual(
	context: Rule.RuleContext,
	a: TSESTree.JSXElement | TSESTree.JSXExpression | TSESTree.Literal,
	b: TSESTree.JSXElement | TSESTree.JSXExpression | TSESTree.Literal | null
) {
	if (a === b) {
		return true
	}

	if (b === null) {
		return false
	}

	if (
		a.type === AST_NODE_TYPES.JSXElement
		|| b.type === AST_NODE_TYPES.JSXElement
	) {
		return true
	}

	if ("expression" in a) {
		a = a.expression
	}
	const evaluatedA = ASTUtils.getStaticValue(a, context.sourceCode.getScope(a))
	if ("expression" in b) {
		b = b.expression
	}
	const evaluatedB = ASTUtils.getStaticValue(b, context.sourceCode.getScope(b))

	console.log(evaluatedA, evaluatedB)

	if (evaluatedA && evaluatedB) {
		return evaluatedA.value === evaluatedB.value
	}

	return stableStringify(context, a) === stableStringify(context, b)
}

function stableStringify(context: Rule.RuleContext, obj: {}) {
	return JSON.stringify(obj, (key, value: unknown) => {
		if (key === "loc" || key === "range" || key === "parent") {
			return undefined
		}

		if (typeof value !== "object") {
			return value
		}

		if (value == null) {
			return value
		}

		if (Array.isArray(value)) {
			return value
		}

		return (
			ASTUtils.getStaticValue(value, context.sourceCode.getScope(value))
			?? Object.fromEntries(
				Object.entries(value).sort(([a], [b]) => a.localeCompare(b))
			)
		)
	})
}
