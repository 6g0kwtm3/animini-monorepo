import * as cookie from "cookie"
import RelayRuntime, {
	Environment,
	Network,
	RecordSource,
	Store,
	type CacheConfig,
	type RequestParameters,
	type UploadableMap,
	type Variables,
} from "relay-runtime"
import { JsonToToken } from "../viewer"

import { GraphQLResponse } from "./schema"

import { addBreadcrumb } from "@sentry/react"
import { ArkErrors, type } from "arktype"

import { invariant } from "../invariant"
import { isString } from "../Predicate"
import { RateLimiter } from "./RateLimiter"
import { withRetry, type WithRetry } from "./withRetry"
const { ROOT_TYPE } = RelayRuntime

const API_URL = "https://graphql.anilist.co"
const fetchQuery = async function (
	operation: RequestParameters,
	variables: Variables,
	cacheConfig: CacheConfig,
	uploadables?: null | UploadableMap
): Promise<WithRetry<typeof GraphQLResponse.inferOut>> {
	const cookies = cookie.parse(document.cookie)

	let token = cookies["anilist-token"]

	if (isString(token)) {
		const parsedToken = JsonToToken(token)
		token = parsedToken instanceof ArkErrors ? undefined : parsedToken.token
	}

	const body = JSON.stringify({ query: operation.text, variables: variables })

	let headers = type(["instanceof", Headers])(cacheConfig.metadata?.headers)
	if (headers instanceof ArkErrors) {
		headers = new Headers()
	}
	headers.set("Content-Type", "application/json")
	headers.set("Accept", "application/json")

	if (token) {
		headers.set("Authorization", `Bearer ${token}`)
	}

	const request = await rateLimitedFetch(API_URL, {
		body: body,
		method: "POST",
		headers,
	})

	const rawRetryAfter = request.headers.get("retry-after")
	const retryAfter = Number(rawRetryAfter)
	if (isFinite(retryAfter) && retryAfter > 0) {
		return {
			kind: "Retry",
			retryAfter: retryAfter + 1,
			cause: { headers: request.headers, text: await request.text() },
		}
	}

	const response = invariant(GraphQLResponse(await request.json()))

	return { kind: "Data", data: response }
}

const rateLimiter =
	typeof document === "undefined"
		? undefined
		: new RateLimiter({ limit: 4, per: Temporal.Duration.from({ seconds: 1 }) })

const rateLimitedFetch = rateLimiter
	? (input: string | URL, init?: RequestInit): Promise<Response> =>
			rateLimiter.execute(() => fetch(input, init))
	: fetch

// Create a network layer from the fetch function
const network = Network.create((...args) =>
	withRetry(() => fetchQuery(...args), { maxRetries: 5 })
)

// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace globalThis {
	let __RELAY_STORE__: Store | undefined
}

globalThis.__RELAY_STORE__ ??= new Store(new RecordSource(), {
	gcReleaseBufferSize: Infinity,
	// queryCacheExpirationTime: 5 * 60 * 1000,
})

const store = globalThis.__RELAY_STORE__

const environment = new Environment({
	network,
	store,
	missingFieldHandlers: [
		{
			handle(field, record, argValues) {
				if (
					record?.getType() === ROOT_TYPE
					&& (field.name === "User"
						|| field.name === "Media"
						|| field.name === "AiringSchedule"
						|| field.name === "Character"
						|| field.name === "Staff"
						|| field.name === "MediaList"
						|| field.name === "Studio"
						|| field.name === "Review"
						|| field.name === "ActivityReply"
						|| field.name === "Thread"
						|| field.name === "ThreadComment"
						|| field.name === "Recommendation")
					&& Object.hasOwn(argValues, "id")
				) {
					return `${field.name}:${String(argValues.id)}`
				}
				return undefined
			},
			kind: "linked",
		},
	],
	relayFieldLogger(event) {
		addBreadcrumb({ level: "info", category: "relay", data: event })
		if (event.kind === "relay_resolver.error") {
			// Log this somewhere!
			console.warn(
				`Resolver error encountered in ${event.owner}.${event.fieldPath}`
			)
			console.warn(event.error)
		}
	},
	getDataID: (data, typeName) =>
		data.id != null ? `${typeName}:${String(data.id)}` : null,
	// ... other options
})

export default environment
