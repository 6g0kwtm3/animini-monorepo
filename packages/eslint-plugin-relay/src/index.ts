import type { ESLint } from "eslint"
import { rule as unusedFields } from "./rule-unused-fields"

const plugin: ESLint.Plugin = {
	meta: { name: "eslint-plugin-relay" },
	rules: { "unused-fields": unusedFields },
}

export default {
	configs: {
		recommended: {
			name: "eslint-plugin-relay/recommended",
			plugins: { "eslint-plugin-relay": plugin },
			rules: { "eslint-plugin-relay/unused-fields": "error" },
		},
	},
} satisfies ESLint.Plugin
