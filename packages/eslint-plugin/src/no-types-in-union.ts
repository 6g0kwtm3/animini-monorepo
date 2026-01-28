import { defineRule } from "oxlint"

export const noTypesInUnion = defineRule({
	meta: {
		type: "suggestion",
		messages: { "no-type-in-union": "There can be no {{ type }} in union" },
		fixable: "code",
	},
	createOnce(context) {
		return {
			TSTypeAliasDeclaration(node) {
				switch (node.typeAnnotation.type) {
					case "TSArrayType": {
						const elementType = node.typeAnnotation
						context.report({
							node: node.typeAnnotation,
							messageId: "no-type-in-union",
							data: { type: "array" },
							fix(fixer) {
								return fixer.replaceText(
									node.typeAnnotation,
									context.sourceCode.getText(elementType)
								)
							},
						})

						break
					}

					case "TSUnionType": {
						const nullType = node.typeAnnotation.types.find(
							(type) =>
								type.type === "TSNullKeyword"
								|| type.type === "TSUndefinedKeyword"
						)
						if (!nullType) return
						context.report({
							node: nullType,
							messageId: "no-type-in-union",
							data: {
								type: {
									TSNullKeyword: "null",
									TSUndefinedKeyword: "undefined",
								}[nullType.type],
							},
							// fix(fixer) {
							// 	return fixer.replaceText(nullType)
							// },
						})
					}
					default:
						const _exhaustiveCheck = node.typeAnnotation.type
						return _exhaustiveCheck
				}
			},
		}
	},
})
