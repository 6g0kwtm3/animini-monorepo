import type { GraphQLESLintRule } from "@graphql-eslint/eslint-plugin"

export const rule: GraphQLESLintRule = {
	meta: {
		type: "suggestion",
		schema: [],
		fixable: "code",
		messages: {
			sort: "Fragment spreads should be at the end of the selection set.",
		},
	},
	create(context) {
		return {
			SelectionSet(node) {
				const selections = node.selections

				const sorted = [
					...selections.filter(
						(selection) => selection.kind !== "FragmentSpread"
					),
					...selections.filter(
						(selection) => selection.kind === "FragmentSpread"
					),
				]

				// Already sorted
				if (
					selections.every((selection, index) => selection === sorted[index])
				) {
					return
				}

				context.report({
					node,
					messageId: "sort",
					fix(fixer) {
						const sourceCode = context.sourceCode
						const first = selections[0]
						const last = selections.at(-1)
						if (first?.range[0] == null || last?.range[1] == null) {
							throw new Error("Invalid node")
						}

						const indentation = sourceCode.text.slice(
							sourceCode.text.lastIndexOf("\n", first.range[0]) + 1,
							first.range[0]
						)

						const text = sorted
							.map((selection) =>
								context.sourceCode.text.slice(
									selection.range[0],
									selection.range[1]
								)
							)
							.join(`\n${indentation}`)

						return fixer.replaceTextRange([first.range[0], last.range[1]], text)
					},
				})
			},
		}
	},
}
