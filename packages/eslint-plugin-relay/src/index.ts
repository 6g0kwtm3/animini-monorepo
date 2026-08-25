import type { ESLint } from "eslint"
import { rule as mustColocateFragmentSpreads } from "./rule-must-colocate-fragment-spreads"
import { rule as requireAliasOnFragmentSpread } from "./rule-require-alias-on-fragment-spread"
import { rule as unusedFields } from "./rule-unused-fields"

const plugin: ESLint.Plugin = {
	meta: { name: "eslint-plugin-relay" },
	rules: {
		"unused-fields": unusedFields,
		"must-colocate-fragment-spreads": mustColocateFragmentSpreads,
		"require-alias-on-fragment-spread": requireAliasOnFragmentSpread,
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
				"eslint-plugin-relay/require-alias-on-fragment-spread": "error",
			},
		},
	},
} satisfies ESLint.Plugin
