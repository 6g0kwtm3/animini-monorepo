// @ts-check
/// <reference path="./eslint-typegen.d.ts" />
import base from "eslint-config/base"
import react from "eslint-config/react"
import * as storybook from "eslint-plugin-storybook"
import typegen from "eslint-typegen"

export default typegen([
	{ ignores: ["storybook-static/"] },
	...base,
	...react,
	...(storybook as unknown as typeof import("eslint-plugin-storybook").default)
		.configs["flat/recommended"],
])
