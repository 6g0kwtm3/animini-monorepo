// @ts-check
/// <reference path="./eslint-typegen.d.ts" />
import base from "eslint-config"
import react from "eslint-config-react"
import typegen from "eslint-typegen"
import { createRequire } from "node:module"

const require = createRequire(import.meta.url)

const storybook =
	require("eslint-plugin-storybook") as typeof import("eslint-plugin-storybook").default

export default typegen([
	{ ignores: ["storybook-static/"] },
	...base,
	...react,
	...storybook.configs["flat/recommended"],
])
