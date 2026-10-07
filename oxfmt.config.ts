import { defineConfig } from "oxfmt"

export default defineConfig({
	sortImports: {
		type: "alphabetical",
		order: "asc",

		groups: [
			["value-builtin", "value-external"],
			"value-internal",
			["value-parent", "value-sibling", "value-index"],
			"unknown",
		],

		newlinesBetween: true,
		newlinesInside: 0,

		internalPattern: ["^~/.+", "^#lib/.+"],

		sortSideEffects: false,
	},
	semi: false,
	useTabs: true,
	trailingComma: "es5",
	objectWrap: "collapse",
	printWidth: 80,
	sortPackageJson: false,
	sortTailwindcss: { functions: ["tv"] },
	ignorePatterns: [
		"**/gql",
		"pnpm-lock.yaml",
		"pnpm-workspace.yaml",
		"worker-configuration.d.ts",

		"**/node_modules",
		"**/.react-router",
		"**/.tsup",
		"**/dist",
		"eslint-suppressions.json",
		"skills",
		"skills-lock.json",
		"apm.lock.yaml",
	],
	endOfLine: process.platform === "win32" ? "crlf" : "lf",
	experimentalOperatorPosition: "start",
})
