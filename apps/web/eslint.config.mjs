// @ts-check
/// <reference path="./eslint-typegen.d.ts" />
import * as graphql from "@graphql-eslint/eslint-plugin"
import base from "eslint-config/base"
import react from "eslint-config/react"
import typegen from "eslint-typegen"
import graphQLConfig from "./graphql.config.js"

export default typegen([
	...base,
	...react,

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
])
