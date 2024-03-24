import cookie from "cookie"

import type { LoaderFunctionArgs } from "@remix-run/cloudflare"
import { type ClientLoaderFunctionArgs, type Params } from "@remix-run/react"

import { Context, Effect, Layer, Option, pipe } from "effect"

import { Schema } from "@effect/schema"

import { JsonToToken } from "./viewer"

import { json } from "@remix-run/cloudflare"
import { clientOnly$ } from "vite-env-only"
import type { TypedDocumentString } from "~/gql/graphql"
import { Remix } from "./Remix/index.server"

const API_URL = "https://graphql.anilist.co"

export type JSONValue = string | number | boolean | JSONObject | JSONArray

export interface JSONObject {
	[x: string]: JSONValue
}

interface JSONArray extends Array<JSONValue> {}

type Result<Data> = Effect.Effect<never, Remix.ResponseError<null>, Data | null>

type Args<Data, Variables> = [
	query: TypedDocumentString<Data, Variables>,
	variables: Variables
]

export interface EffectUrql {
	query: <Data, Variables>(...args: Args<Data, Variables>) => Result<Data>
	mutation: <Data, Variables>(...args: Args<Data, Variables>) => Result<Data>
}

export const EffectUrql = Context.Tag<EffectUrql>("Urql")
export const LoaderArgs = Context.Tag<
	LoaderFunctionArgs | ClientLoaderFunctionArgs
>("loader(args)")

type Arguments = {
	params: Readonly<Params<string>>
	searchParams: URLSearchParams
}

export const ClientArgs = Context.Tag<Arguments>("client/Args")

export class Timeout extends Schema.TaggedError<Timeout>()("Timeout", {
	reset: Schema.number
}) {}
export function operation<T, V>(
	document: TypedDocumentString<T, V>,
	variables: V,
	options?: {
		headers?: Headers
	}
): Effect.Effect<never, Remix.ResponseError<any>, NonNullable<T> | null> {
	return Effect.gen(function* (_) {
		const body = yield* _(
			Schema.encode(Schema.parseJson(Schema.any))({
				query: document.toString(),
				variables: variables
			}),
			Effect.orDie
		)

		const headers = new Headers()
		headers.append("Content-Type", "application/json")
		headers.append("Accept", "application/json")

		for (const [key, value] of options?.headers?.entries() ?? []) {
			headers.append(key, value)
		}

		const response = yield* _(
			Effect.promise(async (signal) =>
				fetch(API_URL, {
					body,
					headers,
					method: "post",
					signal
				})
			)
		)

		if (!response.ok) {
			console.error({
				response,
				body: yield* _(Effect.promise(async () => response.text()))
			})
			return yield* _(
				new Remix.ResponseError({
					response: json(null, {
						status: response.status,
						statusText: response.statusText
					})
				})
			)
		}

		timeout = Math.max(
			timeout,
			pipe(
				Option.fromNullable(response.headers.get("Retry-After")),
				Option.orElse(() =>
					Option.fromNullable(response.headers.get("X-RateLimit-Reset"))
				),
				Option.map(parseInt),
				Option.filter(isFinite),
				Option.getOrElse(() => 0)
			)
		)

		const GraphqlResult = Schema.struct({
			data: Schema.optional(Schema.unknown),
			errors: Schema.optional(Schema.array(Schema.unknown))
		})

		const data = yield* _(Effect.promise(async () => response.json()))

		const result = yield* _(
			Schema.decodeUnknown(GraphqlResult)(data),
			Effect.orDie
		)

		if (result.errors?.length) {
			console.log(result.errors)
		}

		// if (errors?.length) {
		// 	return yield* _(new Timeout({ reset: -1 }))
		// }

		return (result.data as T) ?? null
	})
}
let timeout = 0

export const UrqlLive = Layer.effect(
	EffectUrql,
	Effect.map(Effect.serviceOption(LoaderArgs), (args) => {
		const request = Option.getOrNull(args)?.request

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

		return EffectUrql.of({
			query: (...args) => {
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
			mutation: (...args) => {
				throw new Error("Not implemented")
			}
		})
	})
)

export const ArgsAdapterLive = Layer.effect(
	ClientArgs,
	Effect.map(LoaderArgs, ({ params, request }) => {
		return ClientArgs.of({
			params,
			searchParams: new URL(request.url).searchParams
		})
	})
)

export const LoaderLive = Layer.merge(ArgsAdapterLive, UrqlLive)

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
