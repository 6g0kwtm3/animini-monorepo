// @ts-check
/// <reference path="./eslint-typegen.d.ts" />
import oxlint from "eslint-plugin-oxlint"
import reactCompiler from "eslint-plugin-react-compiler"
import reactRefresh from "eslint-plugin-react-refresh"
import typegen from "eslint-typegen"
import reactPlugin from "eslint-plugin-react"
import * as reactHooks from "eslint-plugin-react-hooks"

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
	...oxlint.buildFromOxlintConfigFile("../../oxlintrc.json"),
])
