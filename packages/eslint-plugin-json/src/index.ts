import json from "@eslint/json"

import { rule as packageNameScope } from "./rule-package-name-scope"

import type { ESLint } from "eslint"

const plugin: ESLint.Plugin = {
	meta: { name: "eslint-plugin-json" },
	rules: { "package-name-scope": packageNameScope },
}

export default {
	configs: {
		recommended: {
			name: "eslint-plugin-json/recommended",
			files: ["**/package.json"],
			language: "json/json",
			plugins: { json, "eslint-plugin-json": plugin },
			rules: { "eslint-plugin-json/package-name-scope": "error" },
		},
	},
} satisfies ESLint.Plugin
