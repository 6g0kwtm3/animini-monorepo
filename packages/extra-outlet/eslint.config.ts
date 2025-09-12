// @ts-check
/// <reference path="./eslint-typegen.d.ts" />
import type { Linter } from "eslint"
import base from "eslint-config"
import react from "eslint-config-react"
import typegen from "eslint-typegen"
const config: Promise<Linter.Config[]> = typegen([...base, ...react])
export default config
