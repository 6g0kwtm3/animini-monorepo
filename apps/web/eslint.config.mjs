// @ts-check
/// <reference path="./eslint-typegen.d.ts" />
import * as graphql from "@graphql-eslint/eslint-plugin"
import base from "eslint-config/base"
import react from "eslint-config/react"
import typegen from "eslint-typegen"
import graphQLConfig from "./graphql.config.js"

export default typegen([
	{
		ignores: [
			"app/gql/",
			"app/paraglide/",
			"public/build/",
			"public/mockServiceWorker.js",
			"**/schema.graphql",
			".react-router/",
		],
	},
	...base,
	...react,
	{
		files: ["**/*.{js,jsx,ts,tsx}"],
		processor: graphql.processors.graphql,
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
])
