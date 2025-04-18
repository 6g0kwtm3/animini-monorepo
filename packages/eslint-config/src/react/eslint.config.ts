// @ts-check
/// <reference path="./eslint-typegen.d.ts" />
import oxlint from "eslint-plugin-oxlint"
import { default as reactPlugin } from "eslint-plugin-react"
import * as reactCompiler from "eslint-plugin-react-compiler"
import * as reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import typegen from "eslint-typegen"
import oxlintConfig from "oxlint-config"

export default await typegen([
	reactPlugin.configs.flat.recommended,
	reactPlugin.configs.flat["jsx-runtime"],
	{
		settings: {
			react: {
				version: "19",
			},
		},
	},
	reactHooks.configs["recommended-latest"],
	reactRefresh.configs.vite,
	reactCompiler.configs.recommended,
	{
		rules: {
			"react-refresh/only-export-components": [
				"error",
				{
					allowExportNames: [
						"meta",
						"links",
						"headers",
						"shouldRevalidate",
						"handler",
						"loader",
						"action",
						"clientLoader",
						"clientAction",
						"unstable_clientMiddleware",
					],
				},
			],
		},
	},
	...oxlint.buildFromOxlintConfig(oxlintConfig),
])
