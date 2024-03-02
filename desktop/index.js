import path, { dirname } from "node:path"
import { fileURLToPath } from "node:url"

import { app, BrowserWindow, dialog } from "electron"
import { initRemix } from "./remix-electron.js"

export {}

const __dirname = dirname(fileURLToPath(import.meta.url))

/** @type {BrowserWindow | undefined} */
let win

/** @param {string} url */
async function createWindow(url) {
	win = new BrowserWindow({ show: false })
	await win.loadURL(url)
	win.show()

	if (process.env.NODE_ENV === "development") {
		win.webContents.openDevTools()
	}
}

app.on("ready", () => {
	void (async () => {
		try {
			if (process.env.NODE_ENV === "development") {
				const { default: installExtension, REACT_DEVELOPER_TOOLS } =
					await import("electron-devtools-installer")

				if (typeof installExtension == "function")
					await installExtension(REACT_DEVELOPER_TOOLS)
			}

			const url = await initRemix({
				serverBuild: path.join(__dirname, "../build/server/index.js")
			})
			await createWindow(url)
		} catch (error) {
			dialog.showErrorBox("Error", getErrorStack(error))
			console.error(error)
		}
	})()
})

/** @param {unknown} error */
function getErrorStack(error) {
	return error instanceof Error ? error.stack || error.message : String(error)
}
