import * as graphql from "@graphql-eslint/eslint-plugin"

import graphQLConfig from "./graphql.config.js"
// @ts-check
/// <reference path="./eslint-typegen.d.ts" />
import react from "eslint-config/react"
import typescript from "eslint-config/typescript"
import typegen from "eslint-typegen"
export default typegen([
	...typescript,
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
