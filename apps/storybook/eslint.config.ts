// @ts-check
/// <reference path="./eslint-typegen.d.ts" />
import base from "eslint-config/base"
import panda from "eslint-config/panda"
import react from "eslint-config/react"
import storybook from "eslint-plugin-storybook"
import typegen from "eslint-typegen"

export default typegen([
	{ ignores: ["storybook-static/"] },
	...base,
	...react,
	...panda,
	...storybook.configs["flat/recommended"],
])
