import { resolve } from "node:path"

/** @typedef {import("@remix-run/node").AppLoadContext} AppLoadContext */
/** @typedef {import("@remix-run/node").ServerBuild} ServerBuild */
/** @typedef {import("@remix-run/express").GetLoadContextFunction} GetLoadContextFunction */

/**
 * @typedef {object} InitRemixOptions
 * @property {ServerBuild | string} serverBuild The path to the server build, or
 *   the server build itself.
 * @property {string} [mode] The mode to run the app in, either development or
 *   production
 * @property {string} [publicFolder] The path where static assets are served
 *   from.
 * @property {GetLoadContextFunction} [getLoadContext] A function to provide a
 *   `context` object to your loaders.
 */

import { createRequestHandler } from "@remix-run/express"
import express from "express"
import { pathToFileURL } from "url"

// @ts-ignore: weird ESM error
import * as webFetch from "@remix-run/web-fetch"

import { app } from "electron"

// only override the File global
// if we override everything else, we get errors caused by the mismatch of built-in types and remix types
global.File = webFetch.File

export {}

/**
 * Initialize and configure remix-electron
 *
 * @param {InitRemixOptions} options
 * @returns {Promise<string>} The url to use to access the app.
 */
export async function initRemix({
	serverBuild: serverBuildOption,
	mode,
	publicFolder: publicFolderOption = "public",
	getLoadContext,
}) {
	await app.whenReady()

	const appRoot = app.getAppPath()

	const viteDevServer =
		process.env.NODE_ENV === "production"
			? undefined
			: await import("vite").then((vite) =>
					vite.createServer({
						server: { middlewareMode: true },
						root: appRoot,
						configFile: resolve(appRoot, "vite.config.ts"),
					}),
				)

	const server = express()

	// handle asset requests
	if (viteDevServer) {
		server.use(viteDevServer.middlewares)
	} else {
		server.use(
			"/assets",
			express.static(resolve(appRoot, "build/client/assets"), {
				immutable: true,
				maxAge: "1y",
			}),
		)
	}

	server.use(express.static(resolve(appRoot, "build/client"), { maxAge: "1h" }))

	const serverBuild =
		typeof serverBuildOption === "string"
			? /** @type {ServerBuild} */ (
					await import(pathToFileURL(serverBuildOption).toString())
				)
			: serverBuildOption

	// handle SSR requests
	server.all(
		"*",
		createRequestHandler({
			build: viteDevServer
				? () =>
						/** @type {Promise<ServerBuild>} */ (
							viteDevServer.ssrLoadModule("virtual:remix/server-build")
						)
				: serverBuild,
			mode,
			getLoadContext,
		}),
	)

	const port = 3000

	await new Promise((resolve) => server.listen(port, () => resolve(undefined)))

	return `http://localhost:${port}/`
}
