// @ts-check
/// <reference path="./eslint-typegen.d.ts" />
import * as graphql from "@graphql-eslint/eslint-plugin"
import base from "eslint-config/base"
import react from "eslint-config/react"
import relay from "eslint-plugin-relay"
import typegen from "eslint-typegen"
import graphQLConfig from "./graphql.config.js"

// @ts-expect-error TODO: fix types
export default typegen([
	{
		name: "web/ignores",
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
			"@graphql-eslint/require-selections": "error",
			// "@graphql-eslint/selection-set-depth": ["warn", { maxDepth: 3 }],
		},
	},
])
