import type * as Electron from "electron"
import { createRequire } from "node:module"

let electron: typeof Electron|string|undefined

try {
	electron = createRequire(import.meta.url)("electron")
} catch {}

export * as anitomy from "anitomy"
export * as fs from "fs"
export { default as path } from "path"

export { electron }
