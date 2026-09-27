import path, { dirname } from "node:path"
import { fileURLToPath } from "node:url"
import config from "../react-router.config.ts"
import { app, BrowserWindow } from "electron"
import { RouterContextProvider } from "react-router"
import { initRemix } from "./remix-electron.js"

const __dirname = dirname(fileURLToPath(import.meta.url))

// Test-only: Playwright sets this to run the app against its own server.
const testServerUrl = process.env.ELECTRON_TEST_SERVER_URL

/**
 * @typedef {object} TestHooks
 * @property {(partition: string) => Promise<void>} openWindow
 * @property {() => void} closeWindows
 */

/** @type {Promise<string> | string | undefined} */
let url

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
	url ??= initRemix({
		buildDirectory: config.buildDirectory,
		serverBuild: path.join(
			__dirname,
			"..",
			config.buildDirectory,
			"server/index.js"
		),
		getLoadContext: () => new RouterContextProvider(),
	})
	await win.loadURL(await url)
}

// Test-only: Playwright opens one window per test, each on its own session
// partition, so that no cookie or cache outlives the test that created it.
if (testServerUrl) {
	url = testServerUrl

	/** @type {TestHooks} */
	const hooks = {
		async openWindow(partition) {
			await app.whenReady()
			await createWindow(partition)
		},
	}

	app.__animedesTest = hooks

	// Playwright launches one app per worker and reuses it across tests. Each test
	// closes its window when it ends, so without this listener Electron's default
	// "quit once the last window is closed" behaviour would kill the app in the
	// middle of the run and every following test would fail.
	void app.on("window-all-closed", () => undefined)
} else {
	void app.whenReady().then(async () => {
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
		if (process.platform !== "darwin") {
			app.quit()
		}
	})
}
