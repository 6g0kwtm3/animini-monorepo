// @ts-check
/// <reference path="./eslint-typegen.d.ts" />
import oxlint from "eslint-plugin-oxlint"
import reactCompiler from "eslint-plugin-react-compiler"
import reactRefresh from "eslint-plugin-react-refresh"
import typegen from "eslint-typegen"
import tseslint from "typescript-eslint"

export default await typegen([
	{
		files: ["**/*.{ts,tsx}"],
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
		rules: {
			...tseslint.configs.recommended[2].rules,
			// ...import_.configs.recommended.rules,
			// ...import_.configs.typescript.rules,
			"@typescript-eslint/no-unnecessary-condition": "error",
			"@typescript-eslint/no-unnecessary-boolean-literal-compare": "error",
			"@typescript-eslint/dot-notation": "error",
			"@typescript-eslint/restrict-plus-operands": "warn",
			"@typescript-eslint/no-floating-promises": "error",
			// "@typescript-eslint/promise-function-async": "error",
			"@typescript-eslint/no-misused-promises": "error",
			"@typescript-eslint/return-await": "error",
			"@typescript-eslint/no-unused-vars": ["warn"],
			"@typescript-eslint/explicit-module-boundary-types": "warn",
			"@typescript-eslint/method-signature-style": ["error", "property"],
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/no-empty-object-type": "off",
		},
	},
	{
		files: ["**/*.{js,jsx,ts,tsx}"],
		plugins: {
			"react-refresh": reactRefresh,
			// compat: compat,
			"react-compiler": reactCompiler,
		},
	},

	...oxlint.buildFromOxlintConfigFile("../../oxlintrc.json"),
])
