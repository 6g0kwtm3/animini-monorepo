// @ts-check
/// <reference path="./eslint-typegen.d.ts" />
import * as graphql from "@graphql-eslint/eslint-plugin"
import base from "eslint-config/base"
import react from "eslint-config/react"
import typegen from "eslint-typegen"
import { rule } from "./app/lib/rule-unused-fields"
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
	{
		name: "web/graphql-processor",
		files: ["**/*.{js,jsx,ts,tsx}"],
		processor: graphql.processors.graphql,
		plugins: { "@anilist-graphql": { rules: { "rule-unused-fields": rule } } },
		rules: { "@anilist-graphql/rule-unused-fields": "error" },
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
