import RelayRuntime, {
	Environment,
	Network,
	RecordSource,
	Store,
	type FetchFunction,
} from "relay-runtime"

import { Effect, Option, pipe, Schedule } from "effect"

import { Schema } from "@effect/schema"

import {
	HttpBody,
	HttpClient,
	HttpClientRequest,
	HttpClientResponse,
	Headers as HttpHeaders,
} from "@effect/platform"

import { GraphQLResponse, Timeout } from "./schema"

const { ROOT_TYPE } = RelayRuntime

const API_URL = "https://graphql.anilist.co"
const fetchQuery_: FetchFunction = async function (
	operation,
	variables,
	cacheConfig
) {
	const token = sessionStorage.getItem("anilist-token")

	return pipe(
		Effect.gen(function* () {
			const body = yield* HttpBody.json({
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

			const request = HttpClientRequest.post(API_URL, {
				body: body,
				headers,
			})

			const response = yield* Effect.catchTag(
				HttpClient.fetchOk(request),
				"ResponseError",
				(error) => {
					if (error.response.status === 429) {
						return new Timeout({
							cause: error,
							reset: pipe(
								error.response.headers,
								HttpHeaders.get("retry-after"),
								Option.getOrElse(() => "60")
							),
						})
					}

					return Effect.succeed(error.response)
				}
			)

			const result =
				yield* HttpClientResponse.schemaBodyJson(GraphQLResponse)(response)

			if ("errors" in result && result.errors?.length) {
				yield* Effect.logWarning(...result.errors)
			}

			return result
		}),
		Effect.withTracerEnabled(false),
		Effect.catchTags({
			RequestError: Effect.die,
			HttpBodyError: Effect.die,
			ParseError: Effect.die,
		}),
		Effect.scoped,
		Effect.retry({
			schedule: Schedule.intersect(
				Schedule.jittered(Schedule.exponential("60 seconds")),
				Schedule.recurs(10)
			),
			while: (error) => error instanceof Timeout,
		}),
		Effect.runPromise
	)
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
