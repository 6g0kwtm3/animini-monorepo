import cookie from "cookie"
import ReactRelay from "react-relay"
import RelayRuntime, {
	Environment,
	Network,
	RecordSource,
	type FetchFunction,
} from "relay-runtime"

import { Effect, Option, pipe, Schedule } from "effect"

import { Schema } from "@effect/schema"

import { JsonToToken } from "../viewer"

import { json } from "@remix-run/node"

import { Remix } from "../Remix"

import * as Http from "@effect/platform/HttpClient"

import { GraphQLResponse, Timeout } from "./schema"

import LiveResolverStore from "relay-runtime/lib/store/experimental-live-resolvers/LiveResolverStore"
import ResolverFragments from "relay-runtime/store/ResolverFragments"
const { ROOT_TYPE } = RelayRuntime

const { RelayFeatureFlags } = RelayRuntime

RelayFeatureFlags.ENABLE_RELAY_RESOLVERS = true

const API_URL = "https://graphql.anilist.co"
const fetchQuery_: FetchFunction = async function (
	operation,
	variables,
	cacheConfig,
	uploadables
) {
	const cookies = cookie.parse(document.cookie)

	const token = pipe(
		cookies["anilist-token"],
		Option.fromNullable,
		Option.flatMap(Schema.decodeOption(JsonToToken)),
		Option.map(({ token }) => token),
		Option.getOrUndefined
	)

	return pipe(
		Effect.gen(function* () {
			const body = yield* Http.body.json({
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

			const request = Http.request.post(API_URL, {
				body: body,
				headers,
			})

			const response = yield* Http.client.fetchOk(request)

			const result =
				yield* Http.response.schemaBodyJson(GraphQLResponse)(response)

			if ("errors" in result && result.errors?.length) {
				yield* Effect.logWarning(...result.errors)
			}

			return result
		}),
		Effect.withTracerEnabled(false),
		Effect.catchTags({
			RequestError: Effect.die,
			BodyError: Effect.die,
			ParseError: Effect.die,
			ResponseError: (error) => {
				if (error.response.status === 429) {
					return new Timeout({
						reset: pipe(
							error.response.headers,
							Http.headers.get("retry-after"),
							Option.getOrElse(() => "60")
						),
					})
				}

				return new Remix.ResponseError({
					response: json(null, {
						status: error.response.status,
						statusText: "",
					}),
				})
			},
		}),
		Effect.scoped,
		Effect.retry({
			schedule: Schedule.intersect(
				Schedule.jittered(Schedule.exponential("5 seconds")),
				Schedule.recurs(10)
			),
			while: (error) => error instanceof Timeout,
		}),
		Effect.runPromise
	)
}

// Create a network layer from the fetch function
const network = Network.create(fetchQuery_)
const store = new LiveResolverStore(new RecordSource())

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
					argValues.hasOwnProperty("id")
				) {
					return `${field.name}:${argValues.id}`
				}
				return undefined
			},
			kind: "linked",
		},
	],
	requiredFieldLogger(event) {
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

export const { readFragment } = ResolverFragments

export const {
	commitMutation,
	fetchQuery,
	RelayEnvironmentProvider,
	useFragment,
	readInlineData,
} = ReactRelay

export default environment
