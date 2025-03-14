// @ts-check
/// <reference path="./eslint-typegen.d.ts" />
import oxlint from "eslint-plugin-oxlint"
import reactPlugin from "eslint-plugin-react"
import reactCompiler from "eslint-plugin-react-compiler"
import * as reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import typegen from "eslint-typegen"

export default await typegen([
	reactPlugin.configs.flat.recommended,
	reactPlugin.configs.flat["jsx-runtime"],
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
	...oxlint.buildFromOxlintConfigFile(
		"./node_modules/oxlint-config/oxlintrc.json"
	),
])
