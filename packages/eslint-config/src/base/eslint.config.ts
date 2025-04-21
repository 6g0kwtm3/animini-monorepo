// @ts-check
/// <reference path="./eslint-typegen.d.ts" />
import eslint from "@eslint/js"
import oxlint from "eslint-plugin-oxlint"

import turbo from "eslint-plugin-turbo"
import typegen from "eslint-typegen"
import oxlintConfig from "oxlint-config" with { type: "json" }
import path from "path"
import tseslint from "typescript-eslint"

export default await typegen([
	{
		name: "eslint-config/base/ignores",
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
	...[
		...tseslint.configs.strictTypeChecked,
		...tseslint.configs.stylisticTypeChecked,
	].map((config) => ({
		files: [
			"**/*.js",
			"**/*.cjs",
			"**/*.mjs",
			"**/*.jsx",
			"**/*.cjsx",
			"**/*.mjsx",
			"**/*.ts",
			"**/*.cts",
			"**/*.mts",
			"**/*.tsx",
			"**/*.ctsx",
			"**/*.mtsx",
		],
		...config,
	})),
	{
		name: "eslint-config/base/typescript-eslint/parser-options",
		languageOptions: {
			parserOptions: {
				projectService: true,
				project: ["./apps/*/tsconfig.json", "./packages/*/tsconfig.json"],
				tsconfigRootDir: path.join("..", "..", import.meta.dirname),
			},
		},
	},
	{
		name: "eslint-config/base/typescript-eslint/rules",
		rules: {
			"@typescript-eslint/triple-slash-reference": "off",
			"@typescript-eslint/only-throw-error": "off",
		},
	},
	// {
	// files: ["**/*.{ts,tsx}"],
	// rules: {
	// ...import_.configs.recommended.rules,
	// ...import_.configs.typescript.rules,
	// "@typescript-eslint/no-unnecessary-condition": "error",
	// "@typescript-eslint/no-unnecessary-boolean-literal-compare": "error",
	// "@typescript-eslint/dot-notation": "error",
	// "@typescript-eslint/restrict-plus-operands": "warn",
	// "@typescript-eslint/no-floating-promises": "error",
	// "@typescript-eslint/promise-function-async": "error",
	// "@typescript-eslint/no-misused-promises": "error",
	// "@typescript-eslint/return-await": "error",
	// "@typescript-eslint/no-unused-vars": ["warn"],
	// "@typescript-eslint/explicit-module-boundary-types": "warn",
	// "@typescript-eslint/method-signature-style": ["error", "property"],
	// "@typescript-eslint/no-explicit-any": "off",
	// "@typescript-eslint/no-empty-object-type": "off",
	// 	},
	// },

	// turbo.configs["flat/recommended"],

	{
		rules: {
			"no-undef": "off",
			"no-unused-vars": "off",
			"no-throw-literal": "error",
		},
	},
	...oxlint.buildFromOxlintConfig(oxlintConfig),
])
