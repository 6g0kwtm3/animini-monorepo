// @ts-check
/// <reference path="./eslint-typegen.d.ts" />
import base from "eslint-config"
import react from "eslint-config-react"
import typegen from "eslint-typegen"
export default typegen([...base, ...react])
