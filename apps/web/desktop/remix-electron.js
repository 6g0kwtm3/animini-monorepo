import { resolve } from "node:path"

/** @typedef {import("react-router").AppLoadContext} AppLoadContext */
/** @typedef {import("react-router").ServerBuild} ServerBuild */
/** @import {HttpBindings} from "@hono/node-server" */

/**
 * @typedef {object} InitRemixOptions
 * @property {ServerBuild | string} serverBuild The path to the server build, or
 *   the server build itself.
 * @property {string} [mode] The mode to run the app in, either development or
 *   production
 * @property {string} [publicFolder] The path where static assets are served
 * @property {string} [buildDirectory] The path where the server build is output
 *   from.
 * @property {() => import("react-router").RouterContextProvider} [getLoadContext]
 *   A function to provide a `context` object to your loaders.
 */

import { serve } from "@hono/node-server"
import { serveStatic } from "@hono/node-server/serve-static"
import { app } from "electron"
import { Hono } from "hono"
import { createRequestHandler } from "react-router"
import { pathToFileURL } from "url"
/**
 * Initialize and configure remix-electron
 *
 * @param {InitRemixOptions} options
 * @returns {Promise<string>} The url to use to access the app.
 */
export async function initRemix({
	serverBuild: serverBuildOption,
	mode,
	publicFolder: _publicFolderOption = "public",
	getLoadContext,
	buildDirectory,
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
					})
				)

	const server = /** @type {Hono<{ Bindings: HttpBindings }>} */ (new Hono())

	// handle asset requests
	if (viteDevServer) {
		void server.use(
			(ctx, next) =>
				new Promise((resolve) => {
					viteDevServer.middlewares(ctx.env.incoming, ctx.env.outgoing, () => {
						resolve(next())
					})
				})
		)
	} else {
		void server.use(
			"/assets",
			serveStatic({ root: resolve(appRoot, buildDirectory, "client/assets") })
		)
	}

	void server.use(
		serveStatic({ root: resolve(appRoot, buildDirectory, "client") })
	)

	const serverBuild = viteDevServer
		? () =>
				/** @type {Promise<ServerBuild>} */ (
					viteDevServer.ssrLoadModule("virtual:react-router/server-build")
				)
		: typeof serverBuildOption === "string"
			? /** @type {ServerBuild} */ (
					await import(pathToFileURL(serverBuildOption).toString())
				)
			: serverBuildOption

	// handle SSR requests
	void server.all("*", (ctx) => {
		return createRequestHandler(serverBuild, mode)(
			ctx.req.raw,
			getLoadContext()
		)
	})

	const port = Number(process.env.HONO_PORT) || 5137

	await new Promise((resolve) =>
		serve({ fetch: server.fetch, port }, () => {
			resolve(undefined)
		})
	)

	return `http://localhost:${String(port)}/`
}
