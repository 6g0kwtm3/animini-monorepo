/** @type {import('eslint').Linter.Config} */
module.exports = {
	extends: [
		"plugin:compat/recommended",
		"@remix-run/eslint-config",
		"@remix-run/eslint-config/node",
		"plugin:storybook/recommended",
	],
	plugins: ["react-refresh", "compat", "eslint-plugin-react-compiler"],
	overrides: [
		{
			files: ["*.ts", "*.tsx"],
			parserOptions: {
				project: true,
			},
			rules: {
				"react-compiler/react-compiler": "error",
				"@typescript-eslint/no-unnecessary-condition": "error",
				"@typescript-eslint/no-unnecessary-boolean-literal-compare": "error",
				"@typescript-eslint/dot-notation": "error",
				"@typescript-eslint/restrict-plus-operands": "warn",
				"@typescript-eslint/no-floating-promises": "error",
				"@typescript-eslint/promise-function-async": "error",
				"@typescript-eslint/no-misused-promises": "error",
				"@typescript-eslint/return-await": "error",
			},
		},
		{
			files: ["*.js"],
			processor: "@graphql-eslint/graphql",
		},
		{
			files: ["*.graphql"],
			extends: "plugin:@graphql-eslint/operations-all",
		},
	],
	rules: {
		"no-useless-constructor": "off",
		"@typescript-eslint/no-unused-vars": ["warn"],
		"@typescript-eslint/explicit-module-boundary-types": "warn",
		"@typescript-eslint/method-signature-style": ["error", "property"],
		"react/self-closing-comp": "error",
		"react/jsx-no-useless-fragment": "warn",
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
}
