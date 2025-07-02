import { createNetworkFixture, type NetworkFixture } from "@msw/playwright"
import base from "@playwright/test"

import { addMocksToSchema } from "@graphql-tools/mock"
import fs from "fs"
import { buildSchema, execute, parse } from "graphql"
import { graphql, http, HttpResponse } from "msw"
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

export const test = base.extend<{ worker: NetworkFixture }>({
	worker: createNetworkFixture({
		initialHandlers: [
			http.post("https://graphql.anilist.co", () => HttpResponse.error()),
		],
	}),
})
