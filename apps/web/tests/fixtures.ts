import { defineNetworkFixture, type NetworkFixture } from "@msw/playwright"
import base, { type ElectronApplication } from "@playwright/test"

import { addMocksToSchema } from "@graphql-tools/mock"
import { _electron } from "@playwright/test"
import fs from "fs"
import { buildSchema, execute, parse } from "graphql"
import { graphql, http, HttpResponse, type AnyHandler } from "msw"
import { join } from "path"

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
		if (electron == null) {
			await provide(context)
			return
		}
		await provide(electron.context())
	},

	async page({ context, electron }, provide) {
		if (electron == null) {
			const page = await context.newPage()
			await page.goto("/")
			await provide(page)
			await page.close()
			return
		}

		const page = await electron.firstWindow()
		await provide(page)
		await page.close()
	},
})
