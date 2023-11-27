module.exports = {
	root: true,
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:svelte/recommended",
		"prettier",
	],
	parser: "@typescript-eslint/parser",
	plugins: ["@typescript-eslint"],
	parserOptions: {
		sourceType: "module",
		ecmaVersion: 2020,
		extraFileExtensions: [".svelte"],
	},
	env: {
		browser: true,
		es2017: true,
		node: true,
	},
	overrides: [
		{
			files: ["*.svelte"],
			parser: "svelte-eslint-parser",
			parserOptions: {
				parser: "@typescript-eslint/parser",
			},
		},
		{
			files: ["*.js"],
			processor: "@graphql-eslint/graphql",
		},
		{
			files: ["*.graphql"],
			extends: "plugin:@graphql-eslint/operations-all",
			rules: {
				"@graphql-eslint/match-document-filename": "off",
				"@graphql-eslint/naming-convention": [
					"error",
					{
						VariableDefinition: "camelCase",
						OperationDefinition: {
							style: "PascalCase",
						},
						FragmentDefinition: {
							forbiddenPrefixes: ["Fragment"],
							forbiddenSuffixes: ["Fragment"],
						},
					},
				],
			},
		},
	],
	rules: {
		"@typescript-eslint/ban-types": [
			"error",
			{
				types: {
					any: {
						message: "Use unknown instead",
						fixWith: "unknown",
					},
				},
				extendDefaults: true,
			},
		],
	},
}
