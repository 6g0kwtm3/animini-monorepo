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
		"@typescript-eslint/naming-convention": [
			"error",
			{
				selector: "default",
				format: ["camelCase"]
			},
			{
				selector: "function",
				format: ["camelCase", "PascalCase"]
			},
			{
				selector: "variable",
				format: ["camelCase", "UPPER_CASE"]
			},
			{
				selector: "parameter",
				format: ["camelCase"],
				leadingUnderscore: "allow"
			},
			{
				selector: "memberLike",
				modifiers: ["private"],
				format: ["camelCase"],
				leadingUnderscore: "require"
			},
			{
				selector: "typeLike",
				format: ["PascalCase"]
			},
			{
				selector: [
					"classProperty",
					"objectLiteralProperty",
					"typeProperty",
					"classMethod",
					"objectLiteralMethod",
					"typeMethod",
					"accessor",
					"enumMember"
				],
				format: null,
				modifiers: ["requiresQuotes"]
			}
		],
		"@typescript-eslint/method-signature-style": ["error", "property"],
		"react-refresh/only-export-components": [
			"warn",
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
