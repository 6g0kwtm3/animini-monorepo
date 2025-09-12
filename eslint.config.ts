// @ts-check
/// <reference path="./eslint-typegen.d.ts" />
import typegen from "eslint-typegen"

import { configs } from "eslint-plugin-pnpm"
import type { Linter } from "eslint"

const config: Promise<Linter.Config[]> = typegen([
	{ ignores: ["playwright", "packages", "apps", ".stryker-tmp"] },
	...configs.json,
	...configs.yaml,
])
export default config
