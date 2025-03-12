// @ts-check
/// <reference path="./eslint-typegen.d.ts" />
import typegen from "eslint-typegen"
import reactCompiler from "eslint-plugin-react-compiler"
import reactRefresh from "eslint-plugin-react-refresh"

export default typegen([
	{
		files: ["**/*.{js,jsx,ts,tsx}"],
		plugins: {
			"react-refresh": reactRefresh,
			// compat: compat,
			"react-compiler": reactCompiler,
		},
	},

])