// @ts-check
/// <reference path="./eslint-typegen.d.ts" />
import jsx from "eslint-plugin-jsx"
import oxlint from "eslint-plugin-oxlint"
import { default as reactPlugin } from "eslint-plugin-react"
import { default as reactHooks } from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import typegen from "eslint-typegen"
import oxlintConfig from "oxlint-config" with { type: "json" }

export default await typegen([
	reactPlugin.configs.flat.recommended,
	reactPlugin.configs.flat["jsx-runtime"],
	reactHooks.configs.flat["recommended"],
	reactRefresh.configs.vite,
	jsx.configs.recommended,
	{
		name: "eslint-config-react",
		settings: { react: { version: "19" } },
		rules: {
			"react/jsx-no-leaked-render": "error",
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
						"clientMiddleware",
					],
				},
			],
		},
	},
	...oxlint.buildFromOxlintConfig(oxlintConfig),
])
