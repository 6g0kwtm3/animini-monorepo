import path, { dirname } from "node:path"
import { fileURLToPath } from "node:url"

import { app, BrowserWindow } from "electron"
import { RouterContextProvider } from "react-router"
import { initRemix } from "./remix-electron.js"

export { }

const __dirname = dirname(fileURLToPath(import.meta.url))

/** @type {string | undefined} */
let url

async function createWindow() {
	const win = new BrowserWindow({ show: false })

	url ??=
		process.env.EXISTING_SERVER_URL
		?? (await initRemix({
			serverBuild: path.join(__dirname, "../build/server/index.js"),
			getLoadContext: () => new RouterContextProvider(),
		}))
	await win.loadURL(url)
	win.show()

	if (process.env.NODE_ENV === "development") {
		win.webContents.openDevTools()
	}
}

void app.whenReady().then(async () => {
	if (process.env.NODE_ENV === "development") {
		const { default: installExtension, REACT_DEVELOPER_TOOLS } =
			await import("electron-devtools-installer")

		if (typeof installExtension == "function")
			await installExtension(REACT_DEVELOPER_TOOLS)
	}

	void createWindow()

	void app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			void createWindow()
		}
	})
})

void app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit()
	}
})
