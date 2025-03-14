// @ts-check
/// <reference path="./eslint-typegen.d.ts" />
import eslint from "@eslint/js"
import oxlint from "eslint-plugin-oxlint"

// import turbo from "eslint-plugin-turbo"
import typegen from "eslint-typegen"
import tseslint from "typescript-eslint"

export default await typegen([
	{
		ignores: [
			"**/*.d.ts",
			".tsup",
			"dist",
			"storybook-static",
			"public/build",
			"public/mockServiceWorker.js",
			"**/schema.graphql",
			"app/gql",
			"playwright",
			".wrangler",
			".react-router",
		],
	},
	eslint.configs.recommended,
	...[
		...tseslint.configs.strictTypeChecked,
		...tseslint.configs.stylisticTypeChecked,
	].map(
		/** @returns {import('eslint').Linter.Config} */
		(config) => ({
			...config,
			files: ["**/*.ts", "**/*.tsx"],
			rules: {
				"@typescript-eslint/only-throw-error": "off",
			},
		})
	),
	{
		languageOptions: {
			parserOptions: {
				projectService: true,
				// tsconfigRootDir: import.meta.dirname,
			},
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
	...oxlint.buildFromOxlintConfigFile(
		"./node_modules/oxlint-config/oxlintrc.json"
	),
])
