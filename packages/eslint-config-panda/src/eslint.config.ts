// @ts-check
/// <reference path="./eslint-typegen.d.ts" />
import panda from "@pandacss/eslint-plugin"
import oxlint from "eslint-plugin-oxlint"
import typegen from "eslint-typegen"
import oxlintConfig from "oxlint-config" with { type: "json" }

export default await typegen([
	{ ignores: ["styled-system/", "styled-system-studio/"] },
	{
		plugins: { "@pandacss": panda },
		rules: { ...panda.configs.recommended.rules },
	},
	...oxlint.buildFromOxlintConfig(oxlintConfig),
])
