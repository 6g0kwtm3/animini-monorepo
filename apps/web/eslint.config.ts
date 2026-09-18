// @ts-check
import * as graphql from "@graphql-eslint/eslint-plugin"
import base from "eslint-config"
import react from "eslint-config-react"
import relay from "eslint-plugin-relay"
import graphQLConfig from "./graphql.config.js"

export default [
	{
		name: "web/ignores",
		ignores: [
			"app/gql/",
			"app/paraglide/",
			"public/dist/",
			"public/mockServiceWorker.js",
			"**/schema.graphql",
			".react-router/",
		],
	},
	...base,
	...react,
	relay.configs.recommended,
	{
		name: "web/@graphql-eslint/eslint-plugin/processor",
		files: ["**/*.{js,jsx,ts,tsx}"],
		processor: graphql.processors.graphql,
	},
	{
		name: "web/@graphql-eslint/eslint-plugin/rules",
		files: ["**/*.graphql"],
		languageOptions: {
			parser: graphql.parser,
			parserOptions: { graphQLConfig: graphQLConfig },
		},
		plugins: { "@graphql-eslint": { rules: graphql.rules } },
		rules: {
			"@graphql-eslint/no-deprecated": "error",
			"@graphql-eslint/no-duplicate-fields": "error",
			// "@graphql-eslint/require-selections": "error",
			// "@graphql-eslint/selection-set-depth": ["warn", { maxDepth: 3 }],
		},
	},
]
