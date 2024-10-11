import { addMocksToSchema } from "@graphql-tools/mock"
import { test as baseTest } from "@playwright/test"
import fs from "fs"
import { buildSchema, execute, parse } from "graphql"
import { getResponse, graphql, HttpResponse, type RequestHandler } from "msw"
interface Fixtures {
	api: { use: (handlers: Array<RequestHandler>) => void }
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
	const raw = await fs.promises.readFile("./schema.graphql", {
		encoding: "utf-8",
	})

	return addMocksToSchema({ schema: buildSchema(raw) })
})

export const SucccessHandler = graphql.operation<any, any>(async (args) => {
	return HttpResponse.json(
		await execute({
			document: parse(args.query),
			schema: await schema(),
			variableValues: args.variables,
		})
	)
})

export const test = baseTest.extend<Fixtures>({
	async page({ page }, use) {
		await page.route("https://graphql.anilist.co/", async (route, request) => {
			if (request.method() === "POST") {
				return route.abort()
			}
			route.continue()
		})
		await use(page)
	},
	async api({ page }, use) {
		let handlers: RequestHandler[] = []

		await page.route("https://graphql.anilist.co/", async (route, request) => {
			const response = await getResponse(
				handlers,
				new Request(request.url(), {
					method: request.method(),
					body: request.postDataBuffer(),
				})
			)

			if (response) {
				return route.fulfill({
					json: await response.json(),
					headers: Object.fromEntries(response.headers.entries()),
					status: response.status,
				})
			}

			route.fallback()
		})

		use({
			use(handlers_) {
				handlers = handlers_
			},
		})
	},
})
