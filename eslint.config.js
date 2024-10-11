import eslint from "@eslint/js"
import * as graphql from "@graphql-eslint/eslint-plugin"
import * as import_ from "eslint-plugin-import"
import jsxA11y from "eslint-plugin-jsx-a11y"
import react from "eslint-plugin-react"
import reactCompiler from "eslint-plugin-react-compiler"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import storybook from "eslint-plugin-storybook"
import tseslint from "typescript-eslint"
import graphQLConfig from "./graphql.config.js"
import oxlint from "eslint-plugin-oxlint"

export default tseslint.config(
	{
		ignores: [
			"build",
			"public/build",
			"public/mockServiceWorker.js",
			"**/schema.graphql",
			"app/gql",
			"playwright",
			".storybook",
		],
	},
	// ...flat.extends(
	// "plugin:compat/recommended",
	// "@remix-run/eslint-config",
	// "@remix-run/eslint-config/node"
	// ),
	eslint.configs.recommended,
	tseslint.configs.base,

	{
		files: ["**/*.{js,jsx,ts,tsx}"],
		settings: {
			react: {
				version: "detect",
			},
			formComponents: ["Form"],
			linkComponents: [
				{ name: "Link", linkAttribute: "to" },
				{ name: "NavLink", linkAttribute: "to" },
			],
			"import/resolver": {
				typescript: {},
			},
		},
		plugins: {
			"react-refresh": reactRefresh,
			// compat: compat,
			react: react,
			"react-hooks": reactHooks,
			"react-compiler": reactCompiler,
			"jsx-a11y": jsxA11y,
		},
		rules: {
			...react.configs.flat.recommended.rules,
			...react.configs["jsx-runtime"].rules,
			...reactHooks.configs.recommended.rules,
			...jsxA11y.configs.recommended.rules,
			"react-compiler/react-compiler": "error",
			"react/self-closing-comp": "error",
			"react/jsx-no-useless-fragment": "warn",
			"react/prop-types": "off",
			"react-refresh/only-export-components": [
				"error",
				{
					allowConstantExport: true,
					allowExportNames: [
						"meta",
						"links",
						"headers",
						"loader",
						"action",
						"clientAction",
						"clientLoader",
						"config",
						"handle",
						"shouldRevalidate",
					],
				},
			],
		},
	},
	{
		files: ["**/*.{ts,tsx}"],
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
		settings: {
			"import/internal-regex": "^~/",
			"import/resolver": {
				node: {
					extensions: [".ts", ".tsx"],
				},
				typescript: {
					alwaysTryTypes: true,
				},
			},
		},
		plugins: {
			import: import_,
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
			"@typescript-eslint/promise-function-async": "error",
			"@typescript-eslint/no-misused-promises": "error",
			"@typescript-eslint/return-await": "error",
			"@typescript-eslint/no-unused-vars": ["warn"],
			"@typescript-eslint/explicit-module-boundary-types": "warn",
			"@typescript-eslint/method-signature-style": ["error", "property"],
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/no-empty-object-type": "off",
		},
	},

	...storybook.configs["flat/recommended"],
	{
		files: ["**/*.{js,jsx,ts,tsx}"],
		processor: graphql.processors.graphql,
		// languageOptions: { parser: tsparser },
	},
	{
		files: ["**/*.graphql"],
		languageOptions: {
			parser: graphql.parser,
			parserOptions: {
				graphQLConfig: graphQLConfig,
			},
		},
		plugins: {
			"@graphql-eslint": { rules: graphql.rules },
		},
		rules: {
			"@graphql-eslint/no-deprecated": "error",
			"@graphql-eslint/no-duplicate-fields": "error",
			"@graphql-eslint/require-selections": "error",
			// "@graphql-eslint/selection-set-depth": ["warn", { maxDepth: 3 }],
		},
	},
	{
		rules: {
			"no-undef": "off",
			"no-unused-vars": "off",
		},
	},
	oxlint.configs["flat/recommended"]
)
