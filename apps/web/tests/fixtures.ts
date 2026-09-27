import { defineNetworkFixture, type NetworkFixture } from "@msw/playwright"
import base, { type ElectronApplication, type Page } from "@playwright/test"
import { Viewer } from "../app/lib/viewer/index"
import { addMocksToSchema } from "@graphql-tools/mock"
import { _electron } from "@playwright/test"
import fs from "fs"
import { buildSchema, execute, parse } from "graphql"
import { graphql, http, HttpResponse, type AnyHandler } from "msw"
import { join } from "path"
import { cookieStorePolyfill } from "./cookie-store-polyfill"

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
}
export interface Fixtures extends Options {
	handlers: AnyHandler[]
	worker: NetworkFixture
	electron: ElectronApplication | null
	newPage: () => Promise<Page>
	login: (viewer: typeof Viewer.infer) => Promise<void>
}

export const test = base.extend<Fixtures>({
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

	isElectron: [false, { option: true }],

	async electron({ baseURL, isElectron }, provide) {
		if (isElectron) {
			const app = await _electron.launch({
				args: ["."],
				env: {
					...process.env,
					...(baseURL ? { EXISTING_SERVER_URL: baseURL } : {}),
				},
				// env: { HONO_PORT: String(5137 + testInfo.workerIndex) },
			})

			await provide(app)
			await app.close()
			return
		}
		await provide(null)
	},

	async context({ context, electron }, provide) {
		const resolved = electron == null ? context : electron.context()
		// No-op where `cookieStore` is implemented natively, and never runs for
		// the already-loaded electron window, which is chromium anyway.
		await resolved.addInitScript(cookieStorePolyfill)
		// The page is closed by the time a fixture tears down, so anything worth
		// reading back has to be reported by the page while it is still alive.
		await resolved.addInitScript(watchPage)

		// The app reports resolver and network failures through `console`, and a
		// render that never happens is otherwise indistinguishable from a slow
		// one, so report what the page was actually doing when a test fails.
		const problems: string[] = []
		const watch = (page: Page) => {
			void page.on("pageerror", (error) => {
				void problems.push(`pageerror: ${error.message}`)
			})
			void page.on("console", (message) => {
				const text = message.text()
				if (text.startsWith(SNAPSHOT)) {
					void problems.push(text)
				} else if (message.type() === "error" || message.type() === "warning") {
					void problems.push(`console.${message.type()}: ${text}`)
				}
			})
		}
		for (const page of resolved.pages()) {
			watch(page)
		}
		void resolved.on("page", watch)

		await provide(resolved)

		const testInfo = test.info()
		if (testInfo.status === testInfo.expectedStatus) {
			return
		}
		for (const problem of problems) {
			console.log(`page problem: ${problem}`)
		}
	},

	page() {
		throw new Error("Use `newPage` instead")
	},

	async newPage({ context, electron }, provide) {
		await provide(async () => {
			if (electron == null) {
				const page = await context.newPage()
				await page.goto("/")
				return page
			}

			const page = await electron.firstWindow()
			return page
		})
	},

	login({ context }, provide) {
		return provide(async (viewer: typeof Viewer.infer) => {
			await context.addCookies([
				{
					name: `anilist-token`,
					value: JSON.stringify({ token: "", viewer }),
					sameSite: "Lax",
					expires: Date.now() / 1000 + 8 * 7 * 24 * 60 * 60, // 8 weeks
					// node doesn't support Temporal
					// Temporal.Now.instant().add({ weeks: 8 }).epochMilliseconds / 1000,
					path: "/",
					domain: "localhost",
				},
			])
		})
	},
})

const SNAPSHOT = "page snapshot:"

/**
 * Reports the cookie and the rendered navigation whenever either changes, so a
 * failed assertion leaves behind a timeline of what the page was actually doing.
 *
 * The cookie value is never included, only what a resolver could derive from it,
 * so that a test using a real credential can't log one.
 *
 * Serialized into the page by `addInitScript`, so it must not close over
 * anything from this module, `marker` included.
 */
function watchPage() {
	const marker = "page snapshot:"
	const readViewer = (raw: string | undefined): unknown => {
		if (raw == null) {
			return null
		}
		try {
			const parsed: unknown = JSON.parse(raw)
			return typeof parsed === "object" && parsed != null && "viewer" in parsed
				? parsed.viewer
				: "unexpected shape"
		} catch {
			return "unparseable"
		}
	}

	const sample = () => {
		const raw = document.cookie
			.split(";")
			.map((pair) => pair.trim())
			.map((pair) => pair.slice(pair.indexOf("=") + 1))
			.find((value) => value.startsWith("{"))
		const writes = (window as unknown as Record<string, unknown>)
			.__cookieStoreWrites
		return JSON.stringify({
			viewer: readViewer(raw),
			length: raw?.length ?? 0,
			cookies: document.cookie
				.split(";")
				.map((pair) => pair.trim())
				.filter((pair) => pair.length > 0)
				.map((pair) => pair.slice(0, pair.indexOf("="))),
			writes: Array.isArray(writes) ? writes.slice(-2) : null,
			links: Array.from(document.querySelectorAll("nav a"), (link) =>
				(link.textContent ?? "").trim()
			),
			path: location.pathname,
		})
	}

	let previous = sample()
	console.log(`${marker} ${previous}`)
	void setInterval(() => {
		const current = sample()
		if (current === previous) {
			return
		}
		previous = current
		console.log(`${marker} ${current}`)
	}, 100)
}
