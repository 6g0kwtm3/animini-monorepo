// @ts-check

import eslintPluginJson from "@animedes/eslint-plugin-json"
import { configs } from "eslint-plugin-pnpm"

import type { Linter } from "eslint"

const config: Linter.Config[] = [
	{
		ignores: [
			"playwright",
			"packages",
			"apps",
			".stryker-tmp",
			".vscode/apm_modules",
		],
	},
	...configs.json,
	...configs.yaml,
	eslintPluginJson.configs.recommended,
]
export default config
