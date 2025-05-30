// @ts-check
/// <reference path="./eslint-typegen.d.ts" />
import type { Linter } from "eslint"
import base from "eslint-config/base"
import react from "eslint-config/react"
import * as storybook from "eslint-plugin-storybook"
import typegen from "eslint-typegen"

declare module "eslint-plugin-storybook" {
	export const configs: { ["flat/recommended"]: Linter.Config[] }
}

export default typegen([
	{ ignores: ["storybook-static/"] },
	...base,
	...react,
	...storybook.configs["flat/recommended"],
])
