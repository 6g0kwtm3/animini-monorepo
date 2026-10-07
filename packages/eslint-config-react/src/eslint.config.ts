// @ts-check

import jsx from "eslint-plugin-jsx"
import oxlint from "eslint-plugin-oxlint"
import { default as reactPlugin } from "eslint-plugin-react"
import oxlintConfig from "oxlint-config" with { type: "json" }

export default [
	reactPlugin.configs.flat.recommended,
	reactPlugin.configs.flat["jsx-runtime"],
	jsx.configs.recommended,
	{
		name: "eslint-config-react",
		settings: { react: { version: "19" } },
		rules: { "react/jsx-no-leaked-render": "error" },
	},
	...oxlint.buildFromOxlintConfig(oxlintConfig),
]
