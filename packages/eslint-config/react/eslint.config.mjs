// @ts-check
/// <reference path="./eslint-typegen.d.ts" />
import oxlint from "eslint-plugin-oxlint"
import reactCompiler from "eslint-plugin-react-compiler"
import reactRefresh from "eslint-plugin-react-refresh"
import typegen from "eslint-typegen"

export default await typegen([
	{
		files: ["**/*.{js,jsx,ts,tsx}"],
		plugins: {
			"react-refresh": reactRefresh,
			// compat: compat,
			"react-compiler": reactCompiler,
		},
	},
	...oxlint.buildFromOxlintConfigFile(
		"./node_modules/oxlint-config/oxlintrc.json"
	),
])
