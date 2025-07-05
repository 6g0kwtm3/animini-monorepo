import type { ESLint, Rule } from "eslint"
import { rule as mustIncludeDataKey } from "./rule-must-include-data-key"

const plugin: ESLint.Plugin = {
	meta: { name: "eslint-plugin-jsx" },
	rules: {
		"rule-must-include-data-key":
			mustIncludeDataKey as unknown as Rule.RuleModule,
	},
}

export default {
	configs: {
		recommended: {
			name: "eslint-plugin-jsx/recommended",
			plugins: { "eslint-plugin-jsx": plugin },
			rules: { "eslint-plugin-jsx/rule-must-include-data-key": "error" },
		},
	},
} satisfies ESLint.Plugin
