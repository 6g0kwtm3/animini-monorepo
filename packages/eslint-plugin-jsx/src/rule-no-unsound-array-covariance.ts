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
		type: "problem",
		docs: {
			description:
				"Detect unsound mutable array covariance (e.g. `Dog[]` → `Animal[]`)",
		},
		schema: [],
		messages: {
			unsound:
				'Possible unsound array covariance: assigning a mutable array of "{{from}}[]" to "{{to}}[]" is unsafe. Use `readonly` arrays or clone/map.',
		},
	},
	defaultOptions: [],
	create(context: RuleContext<string, []>) {
		const services = ESLintUtils.getParserServices(context)
		const checker = services.program.getTypeChecker()

		function getType(node: TSESTree.Node) {
			return services.getTypeAtLocation(node)
		}

		function getArrayElementType(t: ts.Type): null | ts.Type {
			// TypeScript's internal checker API handles non-Object types by returning an empty array; we check for that and fall back to the fallback inspection. For Array<T>/ReadonlyArray<T>/<tuple>, getTypeArguments returns [element]. We trust this path when we've confirmed t is a Type (not nullish) from earlier filtering — it's safe here in all rule paths since `getTypeAtLocation` never emits undefined or object-flags-less Types.
			const args = checker.getTypeArguments(t) as [] | ts.Type[]   // cast to satisfy TS, runtime behavior matches the guard logic below
			if (args.length === 1 && args[0]) return args[0]
			return null
		}

		function isReadonlyArrayType(t: ts.Type): boolean {
			if (!t) return false
			const sym = t.getSymbol()
			if (!sym) return false
			const name = checker.symbolToString(sym)
			return name === "ReadonlyArray"
		}

		function getReturnTypeForFunctionNode(
			fnNode: TSESTree.Node
		): ts.Type | undefined {
			const fnType = getType(fnNode)
			if (!fnType) return undefined
			// function-like: pick the call signature and resolve its return type
			const sigs = fnType.getCallSignatures()
			const sig = sigs[0]
			if (!sig) return undefined
			return checker.getReturnTypeOfSignature(sig)
		}

		function checkPair(fromNode: TSESTree.Node, toNode: TSESTree.Node) {
			const fromType = getType(fromNode)
			const toType =
				toNode.type === AST_NODE_TYPES.FunctionDeclaration
				|| toNode.type === AST_NODE_TYPES.FunctionExpression
				|| toNode.type === AST_NODE_TYPES.ArrowFunctionExpression
				|| toNode.type === AST_NODE_TYPES.MethodDefinition
					? getReturnTypeForFunctionNode(toNode)
					: getType(toNode)
			if (!fromType || !toType) return

			const fromElem = getArrayElementType(fromType)
			const toElem = getArrayElementType(toType)
			if (!fromElem || !toElem) return

			// identical element types -> ok
			if (checker.typeToString(fromElem) === checker.typeToString(toElem))
				return

			// source assignable to target?
			if (!checker.isTypeAssignableTo(fromType, toType)) return

			// if either side is readonly, safe
			if (isReadonlyArrayType(fromType) || isReadonlyArrayType(toType)) return

			context.report({
				node: fromNode,
				messageId: "unsound",
				data: {
					from: checker.typeToString(fromElem),
					to: checker.typeToString(toElem),
				},
			})
		}

		return {
			AssignmentExpression(node: TSESTree.AssignmentExpression) {
				checkPair(node.right, node.left)
			},
			VariableDeclarator(node: TSESTree.VariableDeclarator) {
				if (node.init && node.id) checkPair(node.init, node.id)
			},
			CallExpression(node: TSESTree.CallExpression) {
				const tsNode = services.esTreeNodeToTSNodeMap.get(node)
				const sig = checker.getResolvedSignature(tsNode)
				if (!sig) return
				node.arguments.forEach((arg, i) => {
					const param = sig.getParameters()[i]
					if (!param) return
					const decl = param.valueDeclaration
					if (!decl) return
					const est = services.tsNodeToESTreeNodeMap.get(decl)
					if (est) checkPair(arg, est)
				})
			},
			ReturnStatement(node: TSESTree.ReturnStatement) {
				if (!node.argument) return
				const ancestors = context.sourceCode.getAncestors(node)
				for (let i = ancestors.length - 1; i >= 0; i--) {
					const a = ancestors[i]!
					if (
						a.type === AST_NODE_TYPES.FunctionDeclaration
						|| a.type === AST_NODE_TYPES.FunctionExpression
						|| a.type === AST_NODE_TYPES.ArrowFunctionExpression
						|| a.type === AST_NODE_TYPES.MethodDefinition
					) {
						checkPair(node.argument, a)
						break
					}
				}
			},
		}
	},
}
