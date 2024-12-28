import RelayRuntime, {
	Environment,
	Network,
	RecordSource,
	Store,
	type FetchFunction,
} from "relay-runtime"

import { Option } from "effect"

import { Schema } from "@effect/schema"

import { invariant } from "../invariant"
import { GraphQLResponse, Timeout } from "./schema"

const { ROOT_TYPE } = RelayRuntime

const API_URL = "https://graphql.anilist.co"
const fetchQuery_: FetchFunction = async function (
	operation,
	variables,
	cacheConfig
) {
	const token = sessionStorage.getItem("anilist-token")
	const body = JSON.stringify({
		query: operation.text,
		variables: variables,
	})

	const headers =
		Option.getOrNull(
			Schema.decodeUnknownOption(Schema.instanceOf(Headers))(
				cacheConfig.metadata?.headers
			)
		) ?? new Headers()

	headers.set("Content-Type", "application/json")
	headers.set("Accept", "application/json")

	if (token) {
		headers.set("Authorization", `Bearer ${token}`)
	}

	const response = await fetch(API_URL, {
		method: "POST",
		body: body,
		headers,
	})

	if (response.status === 429) {
		throw new Timeout(response.headers.get("retry-after") ?? "60",)
	}

	return invariant(GraphQLResponse(
		await response.text()
	))
}

declare global {
	var __RELAY_STORE__: Store
}

// Create a network layer from the fetch function
const network = Network.create(fetchQuery_)
const store = (globalThis.__RELAY_STORE__ ??= new Store(new RecordSource(), {
	gcReleaseBufferSize: Infinity,
	queryCacheExpirationTime: 60 * 1000, // 1 minute
}))

const environment = new Environment({
	network,
	store,
	missingFieldHandlers: [
		{
			handle(field, record, argValues) {
				if (
					record != null &&
					record.getType() === ROOT_TYPE &&
					(field.name === "User" ||
						field.name === "Media" ||
						field.name === "AiringSchedule" ||
						field.name === "Character" ||
						field.name === "Staff" ||
						field.name === "MediaList" ||
						field.name === "Studio" ||
						field.name === "Review" ||
						field.name === "ActivityReply" ||
						field.name === "Thread" ||
						field.name === "ThreadComment" ||
						field.name === "Recommendation") &&
					Object.hasOwn(argValues, "id")
				) {
					return `${field.name}:${argValues.id}`
				}
				return undefined
			},
			kind: "linked",
		},
	],
	relayFieldLogger(event) {
		if (event.kind === "relay_resolver.error") {
			// Log this somewhere!
			console.warn(
				`Resolver error encountered in ${event.owner}.${event.fieldPath}`
			)
			console.warn(event.error)
		}
	},
	getDataID: (data, typeName) =>
		data.id != null ? `${typeName}:${data.id}` : null,

	// ... other options
})

export default environment
