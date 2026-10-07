// @ts-check

import base from "eslint-config"
import react from "eslint-config-react"

import type { Linter } from "eslint"

const config: Linter.Config[] = [...base, ...react]
export default config
