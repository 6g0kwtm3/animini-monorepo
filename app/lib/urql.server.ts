import cookie from "cookie"

import type { LoaderFunctionArgs } from "@remix-run/cloudflare"
import { type ClientLoaderFunctionArgs, type Params } from "@remix-run/react"

import { Context, Effect, Layer, Option, Predicate, pipe } from "effect"

import { IS_SERVER } from "./isClient"

import type { TypedDocumentNode } from "@graphql-typed-document-node/core"
import { print } from "graphql"

import { Schema } from "@effect/schema"

import { JsonToToken } from "./viewer"

import { Remix } from "./Remix/index.server"

const API_URL = "https://graphql.anilist.co"

export type JSONValue = string | number | boolean | JSONObject | JSONArray

export interface JSONObject {
	[x: string]: JSONValue
}

interface JSONArray extends Array<JSONValue> {}

export type InferVariables<T> =
	T extends TypedDocumentNode<any, infer V> ? V : never

type Result<Data> = Effect.Effect<never, Remix.ResponseError, Data | null>

type Args<Data, Variables> = [
	query: TypedDocumentNode<Data, Variables> | string,
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
	document: string | TypedDocumentNode<T, V>,
	variables: V,
	options?: {
		headers?: Headers
	}
) {
	return Effect.gen(function* (_) {
		const body = yield* _(
			Schema.encode(Schema.parseJson(Schema.any))({
				query: Predicate.isString(document) ? document : print(document),
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
			Effect.promise((signal) =>
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
				body: yield* _(Effect.promise(() => response.text()))
			})
			return yield* _(
				new Remix.ResponseError({
					response: new Response(null, {
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

		const { data, errors } = yield* _(Effect.promise(() => response.json()))

		if (errors?.length) {
			console.log(errors)
		}

		// if (errors?.length) {
		// 	return yield* _(new Timeout({ reset: -1 }))
		// }

		return (data as T) ?? null
	})
}

let timeout = 0

export const UrqlLive = Layer.effect(
	EffectUrql,
	Effect.map(Effect.serviceOption(LoaderArgs), (args) => {
		const request = Option.getOrNull(args)?.request

		let { "anilist-token": token } = cookie.parse(
			(!IS_SERVER ? globalThis.document.cookie : null) ??
				request?.headers.get("Cookie") ??
				""
		)

		token = pipe(
			token,
			Schema.decodeOption(JsonToToken),
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
