import react from "eslint-config/react"
import typescript from "eslint-config/typescript"
// @ts-check
/// <reference path="./eslint-typegen.d.ts" />
import typegen from "eslint-typegen"
import storybook from "eslint-plugin-storybook"

export default typegen([
	...typescript,
	...react,
	...storybook.configs["flat/recommended"],
])
