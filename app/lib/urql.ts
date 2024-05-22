import cookie from "cookie"

import type { unstable_defineLoader } from "@remix-run/cloudflare"
import { type Params } from "@remix-run/react"

import {
	Context,
	Effect,
	Layer,
	Option,
	pipe,
	Schedule,
	type Scope
} from "effect"

import { Schema } from "@effect/schema"

import { JsonToToken } from "./viewer"

import { json } from "@remix-run/cloudflare"
import { clientOnly$ } from "vite-env-only"
import type { TypedDocumentString } from "~/gql/graphql"
import { Remix } from "./Remix"

import * as Http from "@effect/platform/HttpClient"

const API_URL = "https://graphql.anilist.co"

export type JSONValue = string | number | boolean | JSONObject | JSONArray

export interface JSONObject {
	[x: string]: JSONValue
}

interface JSONArray extends Array<JSONValue> {}

type Result<Data> = Effect.Effect<Data | null, Remix.ResponseError<null>>

type Args<Data, Variables> = [
	query: TypedDocumentString<Data, Variables>,
	variables: Variables
]

// EffectUrql.query

export class LoaderArgs extends Context.Tag("loader(args)")<
	LoaderArgs,
	Parameters<Parameters<typeof unstable_defineLoader>[0]>[0]
>() {}

type Arguments = {
	params: Readonly<Params<string>>
	searchParams: URLSearchParams
}

export class ClientArgs extends Context.Tag("client/Args")<
	ClientArgs,
	Arguments
>() {}

export class Timeout extends Schema.TaggedError<Timeout>()("Timeout", {
	reset: Schema.String
}) {}

const GraphqlResult = Schema.Struct({
	data: Schema.optional(Schema.Unknown),
	errors: Schema.optional(
		Schema.Array(
			Schema.Struct({
				status: Schema.optional(Schema.Number)
			})
		)
	)
})

export function operation<T, V>(
	document: TypedDocumentString<T, V>,
	variables: V,
	options?: {
		headers?: Headers
	}
): Effect.Effect<NonNullable<T> | null, Remix.ResponseError<null> | Timeout> {
	return pipe(
		Effect.gen(function* () {
			const body = yield* Http.body.json({
				query: document.toString(),
				variables: variables
			})

			const headers = new Headers()
			headers.append("Content-Type", "application/json")
			headers.append("Accept", "application/json")

			for (const [key, value] of options?.headers?.entries() ?? []) {
				headers.append(key, value)
			}

			const request = Http.request.post(API_URL, {
				body: body,
				headers
			})

			const response = yield* Http.client.fetchOk(request)

			const result =
				yield* Http.response.schemaBodyJson(GraphqlResult)(response)

			if (result.errors?.length) {
				console.log(result.errors)
			}

			return (result.data as T) ?? null
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
						)
					})
				}

				return new Remix.ResponseError({
					response: json(null, {
						status: error.response.status,
						statusText: error.response.statusText
					})
				})
			}
		}),
		Effect.scoped,
		Effect.retry({
			schedule: Schedule.intersect(
				Schedule.jittered(Schedule.exponential("5 seconds")),
				Schedule.recurs(10)
			),
			while: (error) => error instanceof Timeout
		})
	)
}

const makeClientLive = Effect.gen(function* () {
	const request = Option.getOrNull(
		yield* Effect.serviceOption(LoaderArgs)
	)?.request

	const cookies = cookie.parse(
		clientOnly$(document.cookie) ?? request?.headers.get("Cookie") ?? ""
	)

	const token = pipe(
		cookies["anilist-token"],
		Option.fromNullable,
		Option.flatMap(Schema.decodeOption(JsonToToken)),
		Option.map(({ token }) => token),
		Option.getOrUndefined
	)

	return {
		query: <Data, Variables>(...args: Args<Data, Variables>) => {
			return pipe(
				operation(
					args[0],
					args[1],
					token
						? {
								headers: new Headers({
									Authorization: `Bearer ${token.trim()}`
								})
							}
						: undefined
				)
			)
		},
		mutation: <Data, Variables>(
			...args: Args<Data, Variables>
		): Result<Data> => {
			throw new Error("Not implemented")
		}
	}
})

export const ArgsAdapterLive = Layer.effect(
	ClientArgs,
	Effect.map(LoaderArgs, ({ params, request }) => {
		return ClientArgs.of({
			params,
			searchParams: new URL(request.url).searchParams
		})
	})
)

export class EffectUrql extends Effect.Tag("@services/Urql")<
	EffectUrql,
	Effect.Effect.Success<typeof makeClientLive>
>() {
	static Live = Layer.effect(this, makeClientLive)
}

export const LoaderLive = Layer.merge(ArgsAdapterLive, EffectUrql.Live)

type Letter =
	| "A"
	| "B"
	| "C"
	| "D"
	| "E"
	| "F"
	| "G"
	| "H"
	| "I"
	| "J"
	| "K"
	| "L"
	| "M"
	| "N"
	| "O"
	| "P"
	| "Q"
	| "R"
	| "S"
	| "T"
	| "U"
	| "V"
	| "W"
	| "X"
	| "Y"
	| "Z"

export type CountryCode = `${Letter}${Letter}`
