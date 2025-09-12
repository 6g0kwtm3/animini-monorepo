// @ts-check
/// <reference path="./eslint-typegen.d.ts" />
import type { Linter } from "eslint"
import base from "eslint-config"
import typegen from "eslint-typegen"

const config: Promise<Linter.Config[]> = typegen([...base])
export default config
