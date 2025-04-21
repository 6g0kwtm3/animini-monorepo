import type { ESLint } from "eslint"
import { rule as mustColocateFragmentSpreads } from "./rule-must-colocate-fragment-spreads"
import { rule as unusedFields } from "./rule-unused-fields"

const plugin: ESLint.Plugin = {
	meta: { name: "eslint-plugin-relay" },
	rules: {
		"unused-fields": unusedFields,
		"must-colocate-fragment-spreads": mustColocateFragmentSpreads,
	},
}

export default {
	configs: {
		recommended: {
			name: "eslint-plugin-relay/recommended",
			plugins: { "eslint-plugin-relay": plugin },
			rules: {
				"eslint-plugin-relay/unused-fields": "error",
				"eslint-plugin-relay/must-colocate-fragment-spreads": "error",
			},
		},
	},
} satisfies ESLint.Plugin
