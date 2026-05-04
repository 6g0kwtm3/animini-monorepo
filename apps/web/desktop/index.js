import path, { dirname } from "node:path"
import { fileURLToPath } from "node:url"

import { app, BrowserWindow, session } from "electron"
import { RouterContextProvider } from "react-router"
import { initRemix } from "./remix-electron.js"

export {}

const __dirname = dirname(fileURLToPath(import.meta.url))

/** @type {string | undefined} */
let url

async function createWindow() {
	const mainSession = session.fromPartition("persist:")
	const win = new BrowserWindow({
		show: false,
		webPreferences: { session: mainSession },
	})

	url ??=
		process.env.EXISTING_SERVER_URL
		?? (await initRemix({
			serverBuild: path.join(__dirname, "../build/server/index.js"),
			getLoadContext: () => new RouterContextProvider(),
		}))
	await win.loadURL(url)
	win.show()

	void win.webContents.on("did-navigate-in-page", (event, url) => {
		saveLastPage(url)
	})

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

const storePath = path.join(app.getPath("userData"), "store.json")

import { type } from "arktype"
import fs from "node:fs"
import { invariant } from "../app/lib/invariant.ts"

/** @param {string} url */
function saveLastPage(url) {
	fs.writeFileSync(storePath, JSON.stringify({ lastPage: url }))
}

const LastPage = type({ lastPage: "string" })

/** @returns {string | null} */
function getLastPage() {
	try {
		return invariant(LastPage(JSON.parse(fs.readFileSync(storePath)))).lastPage
	} catch {
		return null
	}
}
