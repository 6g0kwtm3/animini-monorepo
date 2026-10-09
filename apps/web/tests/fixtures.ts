import { addMocksToSchema } from "@graphql-tools/mock"
import { defineNetworkFixture, type NetworkFixture } from "@msw/playwright"
import base, {
	expect,
	type ElectronApplication,
	type Page,
} from "@playwright/test"
import { _electron as Electron } from "@playwright/test"
import fs from "fs"
import { buildSchema, execute, parse } from "graphql"
import { http, HttpResponse, type AnyHandler } from "msw"
import { graphql } from "msw/graphql"
import { join } from "path"

import { TokenToCookie, Viewer } from "../app/lib/viewer/index"
export const anilist = graphql.link("https://graphql.anilist.co")

export const CANARY_NAME = "e2e-pii-canary-name"
export const CANARY_TOKEN = "e2e-pii-canary-token"
export const CANARY_ID = 8675309

const SENTRY_ENVELOPE = "**/*.sentry.io/api/**"

interface EnvelopeItem {
	readonly type: string
	readonly payload: unknown
}

/** Envelopes are newline-delimited JSON: a header, then header/payload pairs. */
function parseEnvelope(body: string): EnvelopeItem[] {
	const lines = body.split("\n").filter((line) => line !== "")
	const items: EnvelopeItem[] = []

	for (let i = 1; i < lines.length; i += 2) {
		const header: unknown = tryParse(lines[i])
		const raw = lines[i + 1]
		if (typeof header !== "object" || header == null || raw == null) {
			continue
		}

		const payload = tryParse(raw)
		const type =
			"type" in header && typeof header.type === "string"
				? header.type
				: "unknown"

		void items.push({ type, payload })
	}

	return items
}

function tryParse(text: string | undefined): unknown {
	if (text == null) {
		return undefined
	}
	try {
		return JSON.parse(text)
	} catch {
		return text
	}
}

function redact(node: unknown, piis: ReadonlySet<number | string>): unknown {
	return JSON.parse(JSON.stringify(node), (key, value: unknown) => {
		if (typeof value === "number") {
			return piis.has(value) ? ":Filtered:" : value
		}
		if (typeof value === "string") {
			for (const pii of piis) {
				if (value.includes(String(pii))) {
					return expect.not.stringContaining(String(pii))
				}
			}
		}
		return value
	})
}

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

export const SuccessHandler = anilist.operation<object>(async (args) => {
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
	markPII: (value: number | string) => void
}

export const test = base.extend<Fixtures>({
	// Initial list of the network handlers.
	handlers: [
		[
			http.all(`https://web-flags.black-grass-3db8.workers.dev/*`, () =>
				HttpResponse.error()
			),
			anilist.operation(() => HttpResponse.error()),
		],
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

	/**
	 * Records everything the page sends to Sentry, and fails the test if any of
	 * the values registered through it survive scrubbing. Depends on `worker`
	 * so MSW's catch-all is registered first: Playwright runs the most recently
	 * added matching route first, so this one sees the request before MSW does
	 * and can hand it back with `route.fallback()` without answering it.
	 */
	markPII: [
		async ({ context, worker }, provide) => {
			void worker
			const payloads: EnvelopeItem[] = []
			const forbidden = new Set<number | string>()

			await context.route(SENTRY_ENVELOPE, async (route) => {
				const envelope =
					route.request().postDataBuffer()?.toString("utf8") ?? ""

				for (const item of parseEnvelope(envelope)) {
					void payloads.push(item)
				}

				await route.fallback()
			})

			await provide((value: number | string) => {
				void forbidden.add(value)
			})

			await context.unroute(SENTRY_ENVELOPE)

			payloads.forEach(({ type, payload }) => {
				expect
					.soft(
						payload,
						`Sentry ${type} payload sent during this test; expect it to have every canary redacted`
					)
					.toEqual(redact(payload, forbidden))
			})
		},
		{ auto: true },
	],

	isElectron: [false, { option: true }],

	async electron({ baseURL, isElectron }, provide) {
		if (isElectron) {
			const app = await Electron.launch({
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
		if (electron == null) {
			await provide(context)
			return
		}
		await provide(electron.context())
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

	login({ context, markPII }, provide) {
		return provide(async (viewer: typeof Viewer.infer) => {
			markPII(viewer.id)
			markPII(viewer.name)
			markPII(CANARY_TOKEN)
			await context.addCookies([
				{
					name: `anilist-token`,
					value: TokenToCookie.from({
						token: CANARY_TOKEN,
						viewer,
						sessionId: crypto.randomUUID(),
					}),
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
