import { defineConfig } from "@pandacss/dev"
import { preset } from "m3-core"

export default defineConfig({
	presets: [preset],
	// Whether to use css reset
	preflight: true,
	// Where to look for your css declarations
	include: [
		"./app/**/*.{js,jsx,ts,tsx}",
		"./node_modules/m3-react/src/**/*.{js,jsx,ts,tsx}",
		"./node_modules/m3-core/src/**/*.{js,jsx,ts,tsx}",
	],

	// Files to exclude
	exclude: [],

	// Useful for theme customization
	theme: { extend: {} },

	importMap: "m3-styled-system",
	// The output directory for your css system
	outdir: "./node_modules/m3-styled-system/styled-system",
	jsxFramework: "react",
	strictTokens: true,
	strictPropertyValues: true,
	staticCss: { recipes: "*" },
})
