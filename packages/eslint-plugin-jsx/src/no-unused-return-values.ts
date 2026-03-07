import {
	AST_NODE_TYPES,
	type TSESTree,
} from "@typescript-eslint/typescript-estree"
import { ESLintUtils } from "@typescript-eslint/utils"
import type {
	RuleContext,
	RuleModule,
} from "@typescript-eslint/utils/ts-eslint"
import * as ts from "typescript"

export const rule: RuleModule<string> = {
	meta: {
		type: "suggestion",
		docs: { description: "" },
		schema: [],
		messages: {
			"return-value-not-used": "Return value of {{ name }} is not used.",
		},
		fixable: "code",
	},
	defaultOptions: [],
	create(context: RuleContext<string, []>) {
		return {
			ExpressionStatement(node: TSESTree.ExpressionStatement) {
				const services = ESLintUtils.getParserServices(context)

				const expression = node.expression

				if (expression.type === AST_NODE_TYPES.CallExpression) {
					const type = services.getTypeAtLocation(expression)

					if (type.flags !== ts.TypeFlags.Void) {
						context.report({
							node: expression,
							messageId: "return-value-not-used",
							data: {
								name:
									expression.callee.type === AST_NODE_TYPES.Identifier
										? expression.callee.name
										: "function",
							},
						})
					}
				}
			},
		}
	},
}
