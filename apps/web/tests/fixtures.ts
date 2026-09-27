import { defineNetworkFixture, type NetworkFixture } from "@msw/playwright"
import base, { type ElectronApplication, type Page } from "@playwright/test"
import { Viewer } from "../app/lib/viewer/index"
import { addMocksToSchema } from "@graphql-tools/mock"
import { _electron } from "@playwright/test"
import fs from "fs"
import { buildSchema, execute, parse } from "graphql"
import { graphql, http, HttpResponse, type AnyHandler } from "msw"
import { join } from "path"
import { serverUrl } from "./serverUrl"

function cached<T>(fn: () => T) {
	let cache: T | undefined
	return () => {
		let result = cache
		if (result === undefined) {
			result = fn()
			cache = result
		}
		return result
	}
}

const schema = cached(async () => {
	const raw = await fs.promises.readFile(
		join(import.meta.dirname, "../schema.graphql"),
		{ encoding: "utf-8" }
	)

	return addMocksToSchema({ schema: buildSchema(raw) })
})

export const SuccessHandler = graphql.operation<object>(async (args) => {
	return HttpResponse.json(
		await execute({
			document: parse(args.query),
			schema: await schema(),
			variableValues: args.variables,
		})
	)
})

interface Options {
	isElectron: boolean
	_reuseContext: boolean
}
export interface WorkerFixtures extends Options {
	electron: ElectronApplication | null
}
export interface Fixtures {
	handlers: AnyHandler[]
	worker: NetworkFixture
	partition: string | undefined
	goto: (page: Page, path: string) => Promise<void>
	newPage: () => Promise<Page>
	cookies: () => Promise<readonly SessionCookie[]>
	login: (viewer: typeof Viewer.infer) => Promise<void>
}

export interface SessionCookie {
	name: string
	value: string
}

interface ElectronTestHooks {
	openWindow: (partition: string) => Promise<void>
	closeWindows: () => void
}

const TOKEN_COOKIE = `anilist-token`

export const test = base.extend<Fixtures, WorkerFixtures>({
	// Initial list of the network handlers.
	handlers: [
		[http.post("https://graphql.anilist.co", () => HttpResponse.error())],
		{ option: true },
	],

	// A fixture you use to control the network in your tests.
	worker: [
		async ({ context, handlers }, provide) => {
			const network = defineNetworkFixture({ context, handlers })

			await network.enable()
			await provide(network)
			await network.disable()
		},
		{ auto: true },
	],

	isElectron: [false, { option: true, scope: "worker" }],

	partition({ isElectron }, provide, testInfo) {
		return provide(isElectron ? `test-${testInfo.testId}` : undefined)
	},

	electron: [
		async ({ isElectron }, provide) => {
			if (!isElectron) {
				await provide(null)
				return
			}

			const app = await _electron.launch({
				args: ["."],
				env: {
					...process.env,
					ANIMEDES_ELECTRON_TEST: "1",
					EXISTING_SERVER_URL: serverUrl,
				},
			})

			await provide(app)
			await app.close()
		},
		{ scope: "worker" },
	],

	async context({ context, electron }, provide) {
		if (electron == null) {
			await provide(context)
			return
		}
		await provide(electron.context())
	},

	page() {
		throw new Error("Use `newPage` instead")
	},

	// Playwright does not give Electron's browser context a `baseURL`, so
	// relative `page.goto()` calls fail there. We resolve app paths ourselves.
	goto: async ({}, use) => {
		await use(async (page: Page, path: string) => {
			await page.goto(new URL(path, serverUrl).href)
		})
	},

	async newPage({ context, electron, partition, _reuseContext }, provide) {
		let opened: Page | undefined

		await provide(async () => {
			if (opened) return opened

			if (electron == null) {
				let [page] = _reuseContext ? context.pages() : []
				if (!page) {
					page = await context.newPage()
					await page.goto("/")
				}
				opened = page
				return page
			}

			if (partition == null) throw new Error("Missing Electron partition")

			const window = electron.waitForEvent("window")
			await electron.evaluate(async ({ app }, partition) => {
				const hooks = (app as unknown as { __animedesTest: ElectronTestHooks })
					.__animedesTest
				await hooks.openWindow(partition)
			}, partition)
			opened = await window
			return opened
		})

		await opened?.close().catch(() => undefined)
		await electron?.evaluate(({ app }) => {
			const hooks = (app as unknown as { __animedesTest: ElectronTestHooks })
				.__animedesTest
			hooks.closeWindows()
		})
	},

	cookies({ context, electron, partition }, provide) {
		return provide(async () => {
			if (electron == null) {
				const cookies = await context.cookies()
				return cookies.map(({ name, value }) => ({ name, value }))
			}

			if (partition == null) throw new Error("Missing Electron partition")

			return await electron.evaluate(async ({ session }, partition) => {
				const cookies = await session.fromPartition(partition).cookies.get({})
				return cookies.map(({ name, value }) => ({ name, value }))
			}, partition)
		})
	},

	login({ context, electron, partition }, provide) {
		return provide(async (viewer: typeof Viewer.infer) => {
			const value = JSON.stringify({ token: "", viewer })
			const expires = Date.now() / 1000 + 8 * 7 * 24 * 60 * 60 // 8 weeks
			// node doesn't support Temporal
			// Temporal.Now.instant().add({ weeks: 8 }).epochMilliseconds / 1000,

			if (electron == null) {
				await context.addCookies([
					{
						name: TOKEN_COOKIE,
						value,
						sameSite: "Lax",
						expires,
						path: "/",
						domain: "localhost",
					},
				])
				return
			}

			if (partition == null) throw new Error("Missing Electron partition")

			await electron.evaluate(
				async ({ session }, { partition, name, value, expires }) => {
					await session
						.fromPartition(partition)
						.cookies.set({
							url: `http://localhost/`,
							name,
							value,
							expirationDate: expires,
							sameSite: "lax",
						})
				},
				{ partition, name: TOKEN_COOKIE, value, expires }
			)
		})
	},
})
