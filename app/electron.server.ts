import { createRequire } from "node:module"

const electron = createRequire(import.meta.url)("electron")

export * as anitomy from "anitomy"
export * as fs from "fs"
export { default as path } from "path"

export default electron
