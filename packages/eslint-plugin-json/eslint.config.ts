// @ts-check

import eslint from "@eslint/js"
import tseslint from "typescript-eslint"

import eslintPluginJson from "./src/index.ts"

/**
 * JavaScript rules need a JavaScript AST, so they are scoped to source files:
 * the JSON entry below lints this package's own `package.json` with the
 * JSON parser, and a JavaScript rule running there would crash.
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
	{ ...eslint.configs.recommended, files: [...sourceFiles] },
	...tseslint.configs.recommended.map((config) => ({ ...config, files: [...sourceFiles] })),
	eslintPluginJson.configs.recommended,
]
