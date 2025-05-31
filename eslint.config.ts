// @ts-check
/// <reference path="./eslint-typegen.d.ts" />
import typegen from "eslint-typegen"

import { configs } from "eslint-plugin-pnpm"

export default typegen([
	{ ignores: ["playwright", "packages", "apps"] },
	...configs.json,
	...configs.yaml,
])
