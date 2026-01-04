// @ts-check
/// <reference path="./eslint-typegen.d.ts" />
import eslint from "@eslint/js"
import oxlint from "eslint-plugin-oxlint"
import perfectionist from "eslint-plugin-perfectionist"
import turbo from "eslint-plugin-turbo"
import typegen from "eslint-typegen"
import oxlintConfig from "oxlint-config" with { type: "json" }
import path from "path"

export default await typegen([
	{
		name: "eslint-config/ignores",
		ignores: [
			".tsup/",
			"dist/",
			"tmp/",
			"playwright/",
			".wrangler/",
			"eslint-typegen.d.ts",
		],
	},
	turbo.configs["flat/recommended"],
	eslint.configs.recommended,
	perfectionist.configs["recommended-natural"],
	{
		rules: {
			"perfectionist/sort-exports": "off",
			"perfectionist/sort-imports": "off",
			"perfectionist/sort-interfaces": "off",
			"perfectionist/sort-intersection-types": "off",
			"perfectionist/sort-jsx-props": "off",
			"perfectionist/sort-modules": "off",
			"perfectionist/sort-named-exports": "off",
			"perfectionist/sort-named-imports": "off",
			"perfectionist/sort-objects": "off",
		},
	},
	{
		rules: {
			"no-undef": "off",
			"no-unused-vars": "off",
			"no-throw-literal": "error",
		},
	},
	...oxlint.buildFromOxlintConfig(oxlintConfig),
])
