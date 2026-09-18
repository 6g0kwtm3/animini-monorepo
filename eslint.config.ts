// @ts-check

import { configs } from "eslint-plugin-pnpm"
import type { Linter } from "eslint"

const config: Linter.Config[] = [
	{ ignores: ["playwright", "packages", "apps", ".stryker-tmp"] },
	...configs.json,
	...configs.yaml,
]
export default config
