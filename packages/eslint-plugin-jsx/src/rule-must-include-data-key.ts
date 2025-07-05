import {
	type TSESTree,
	AST_NODE_TYPES,
} from "@typescript-eslint/typescript-estree"
import { ASTUtils } from "@typescript-eslint/utils"
import type {
	RuleContext,
	RuleModule,
} from "@typescript-eslint/utils/ts-eslint"

export const rule: RuleModule<string> = {
	meta: {
		type: "suggestion",
		docs: { description: "" },
		schema: [],
		messages: {
			"data-key-must-match-key":
				"JSX element with 'key' prop must also have a matching 'data-key' prop.",
		},
		fixable: "code",
	},
	defaultOptions: [],
	create(context: RuleContext<string, []>) {
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

				if (!key) {
					return
				}

				const dataKey = byName["data-key"]

				if (!dataKey || !isEqual(context, key, dataKey)) {
					context.report({
						node: key,
						messageId: "data-key-must-match-key",
						data: {},
						fix(fixer) {
							const fixes = []

							if (dataKey) {
								const fix = fixer.remove(dataKey)
								fix.range = [fix.range[0] - 1, fix.range[1]]
								fixes.unshift(fix)
							}
							return [
								...fixes,
								fixer.insertTextAfter(
									key,
									` data-key${key.value ? `=${context.sourceCode.getText(key.value)}` : ""}`
								),
							]
						},
					})
				}
			},
		}
	},
}

function isEqual(
	context: RuleContext<string, []>,
	a: TSESTree.JSXAttribute,
	b: TSESTree.JSXAttribute
) {
	if (a === b) {
		return true
	}

	if (a.value === b.value) {
		return true
	}

	if (a.value == null || b.value == null) {
		return false
	}

	if (
		a.value.type === AST_NODE_TYPES.JSXElement
		|| b.value.type === AST_NODE_TYPES.JSXElement
	) {
		return true
	}

	const aExpression = "expression" in a.value ? a.value.expression : a.value

	const evaluatedA = getStaticValue(aExpression, context)
	const bExpression = "expression" in b.value ? b.value.expression : b.value

	const evaluatedB = getStaticValue(bExpression, context)

	if (evaluatedA && evaluatedB) {
		return evaluatedA.value === evaluatedB.value
	}

	return stableStringify(context, a.value) === stableStringify(context, b.value)
}

function stableStringify(
	context: RuleContext<string, []>,
	obj: TSESTree.JSXExpression | TSESTree.Literal
) {
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
			getStaticValue(value as TSESTree.Node, context)
			?? Object.fromEntries(
				Object.entries(value).sort(([a], [b]) => a.localeCompare(b))
			)
		)
	})
}

function getStaticValue(node: TSESTree.Node, context: RuleContext<string, []>) {
	return ASTUtils.getStaticValue(node, context.sourceCode.getScope(node))
}
