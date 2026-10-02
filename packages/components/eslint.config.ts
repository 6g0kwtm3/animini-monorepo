// @ts-check

import type { Linter } from "eslint"
import base from "eslint-config"
import react from "eslint-config-react"

const config: Linter.Config[] = [...base, ...react]
export default config
