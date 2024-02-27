/** @type {import('eslint').Linter.Config} */
module.exports = {
	extends: [
		"plugin:compat/recommended",
		"@remix-run/eslint-config",
		"@remix-run/eslint-config/node"
	],
	plugins: ["react-refresh", "compat"],
	overrides: [
		{
			files: ["*.ts", "*.tsx"],
			parserOptions: {
				project: true
			},
			rules: {
				"@typescript-eslint/naming-convention": [
					"warn",
					{
						selector: "function",
						format: ["camelCase", "PascalCase"]
					},
					{
						selector: "variable",
						format: ["camelCase", "UPPER_CASE", "PascalCase"]
					},
					{
						selector: "parameter",
						format: ["camelCase"],
						leadingUnderscore: "allow"
					},
					{
						selector: ["method", "property"],
						modifiers: ["private"],
						format: ["camelCase"],
						leadingUnderscore: "require"
					},
					{
						selector: "typeLike",
						format: ["PascalCase"]
					}
				],
				"@typescript-eslint/no-unnecessary-condition": "error"
			}
		},
		{
			files: ["*.js"],
			processor: "@graphql-eslint/graphql"
		},
		{
			files: ["*.graphql"],
			extends: "plugin:@graphql-eslint/operations-recommended"
		}
	],
	rules: {
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
					"config"
				]
			}
		]
	}
}
