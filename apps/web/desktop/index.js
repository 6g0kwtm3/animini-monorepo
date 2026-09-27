import path, { dirname } from "node:path"
import { fileURLToPath } from "node:url"
import config from "../react-router.config.ts"
import { app, BrowserWindow } from "electron"
import { RouterContextProvider } from "react-router"
import { initRemix } from "./remix-electron.js"

const __dirname = dirname(fileURLToPath(import.meta.url))

/**
 * @typedef {object} TestHooks
 * @property {(partition: string) => Promise<void>} openWindow
 * @property {() => void} closeWindows
 */

/** @type {Promise<string> | undefined} */
let url

function getUrl() {
	url ??= (async () => {
		if (process.env.EXISTING_SERVER_URL) {
			return process.env.EXISTING_SERVER_URL
		}

		return await initRemix({
			buildDirectory: config.buildDirectory,
			serverBuild: path.join(
				__dirname,
				"..",
				config.buildDirectory,
				"server/index.js"
			),
			getLoadContext: () => new RouterContextProvider(),
		})
	})()

	return url
}

/**
 * @param {string} [partition] Session partition, defaults to the app's own.
 */
async function createWindow(partition) {
	const win = new BrowserWindow({
		show: false,
		webPreferences: { partition: partition ?? "persist:" },
	})

	void win.once("ready-to-show", () => {
		win.show()
	})

	if (process.env.NODE_ENV === "development") {
		win.webContents.openDevTools()
	}
	await win.loadURL(await getUrl())
}

// Test-only: Playwright opens one window per test, each on its own session
// partition, so that no cookie or cache outlives the test that created it.
if (process.env.ANIMEDES_ELECTRON_TEST) {
	/** @type {TestHooks} */
	const hooks = {
		async openWindow(partition) {
			await app.whenReady()
			await createWindow(partition)
		},
		closeWindows() {
			for (const win of BrowserWindow.getAllWindows()) {
				win.destroy()
			}
		},
	}

	app.__animedesTest = hooks
}

void app.whenReady().then(async () => {
	if (process.env.ANIMEDES_ELECTRON_TEST) {
		void getUrl()
		return
	}

	if (process.env.NODE_ENV === "development") {
		const { default: installExtension, REACT_DEVELOPER_TOOLS } =
			await import("electron-devtools-installer")

		if (typeof installExtension === "function")
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
	if (process.platform !== "darwin" && !process.env.ANIMEDES_ELECTRON_TEST) {
		app.quit()
	}
})
