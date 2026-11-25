// @ts-check

import jsx from "eslint-plugin-jsx"
import oxlint from "eslint-plugin-oxlint"
import { default as reactPlugin } from "eslint-plugin-react"
import oxlintConfig from "oxlint-config/oxlintrc.json" with { type: "json" }

/**
 * React and JSX rules expect a JavaScript AST, so they must not be applied to
 * files linted with another language - `package.json` among them.
 */
const sourceFiles = [
	"**/*.cjs",
	"**/*.js",
	"**/*.mjs",
	"**/*.mts",
	"**/*.ts",
	"**/*.tsx",
] as const

export default [
	{ ...reactPlugin.configs.flat.recommended, files: [...sourceFiles] },
	{ ...reactPlugin.configs.flat["jsx-runtime"], files: [...sourceFiles] },
	{ ...jsx.configs.recommended, files: [...sourceFiles] },
	{
		name: "eslint-config-react",
		files: [...sourceFiles],
		settings: { react: { version: "19" } },
		rules: { "react/jsx-no-leaked-render": "error" },
	},
	...oxlint.buildFromOxlintConfig(oxlintConfig),
]
