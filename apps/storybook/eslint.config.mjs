// @ts-check
/// <reference path="./eslint-typegen.d.ts" />
import base from "eslint-config/base"
import react from "eslint-config/react"
import storybook from "eslint-plugin-storybook"
import typegen from "eslint-typegen"

export default typegen([
	...base,
	...react,
	...storybook.configs["flat/recommended"],
])
