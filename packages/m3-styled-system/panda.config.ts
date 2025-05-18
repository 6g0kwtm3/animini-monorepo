import { defineConfig } from "@pandacss/dev"
import { preset } from "m3-core"

export default defineConfig({
	presets: [preset],
	// Whether to use css reset
	preflight: true,

	// Where to look for your css declarations
	include: [],

	// Files to exclude
	exclude: [],

	// Useful for theme customization
	theme: { extend: {} },

	// The output directory for your css system
	outdir: "styled-system",
	jsxFramework: "react",
	strictTokens: true,
	strictPropertyValues: true,
})
