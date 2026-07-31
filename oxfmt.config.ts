import { defineConfig } from "oxfmt"

export default defineConfig({
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
		"eslint-typegen.d.ts",
		"**/.react-router",
		"**/.tsup",
		"**/dist",
		"eslint-suppressions.json",
		"skills",
		"skills-lock.json",
	],
	endOfLine: process.platform === "win32" ? "crlf" : "lf",
})
