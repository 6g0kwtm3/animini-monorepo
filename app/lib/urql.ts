import cookie from "cookie"

import type {
	LoaderFunctionArgs,
	TypedDeferredData,
	TypedResponse
} from "@remix-run/node"
import {
	useLoaderData,
	useRouteLoaderData,
	type ClientLoaderFunctionArgs,
	type Params
} from "@remix-run/react"

import {
	Context,
	Data,
	Effect,
	Layer,
	Option,
	Predicate,
	PrimaryKey,
	RequestResolver,
	pipe
} from "effect"

import { IS_SERVER } from "./isClient"

import type { TypedDocumentNode } from "@graphql-typed-document-node/core"
import { parse, print } from "graphql"

import { uneval } from "devalue"
import { useMemo } from "react"

import { Schema } from "@effect/schema"

// Schema.transform()

import type { DocumentNode } from "graphql"
// Cache.make({
// 	capacity: 256,
// 	timeToLive: "60 minutes",
// 	lookup: (key: GqlRequest) => {}
// })

// import { Cache } from "effect"
// Cache.makeWith()

const API_URL = "https://graphql.anilist.co"

class NetworkError extends Data.TaggedError("NetworkError")<{
	reason: string
	error: unknown
}> {}

export function nonNull<T>(value: T): value is NonNullable<T> {
	return value !== undefined && value !== null
}

export type JSONValue = string | number | boolean | JSONObject | JSONArray

interface JSONObject {
	[x: string]: JSONValue
}

interface JSONArray extends Array<JSONValue> {}

export type InferVariables<T> =
	T extends TypedDocumentNode<any, infer V> ? V : never

type Result<Data> = Effect.Effect<never, NetworkError, Data | undefined | null>

type Args<Data, Variables> = [
	query: TypedDocumentNode<Data, Variables> | string,
	variables: Variables
]

export interface EffectUrql {
	query<Data, Variables>(...args: Args<Data, Variables>): Result<Data>
	mutation<Data, Variables>(...args: Args<Data, Variables>): Result<Data>
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

const Document: Schema.Schema<DocumentNode, string> = Schema.transform(
	Schema.any,
	Schema.string,
	print,
	(query) => parse(query)
)

const Variables: Schema.Schema<JSONObject, string> = Schema.transform(
	Schema.record(Schema.string, Schema.any),
	Schema.string,
	(variables) => JSON.stringify(variables),
	(parsed) => JSON.parse(parsed)
)
export class Timeout extends Schema.TaggedError<Timeout>()("Timeout", {
	reset: Schema.number
}) {}

class GqlRequest extends Schema.TaggedRequest<GqlRequest>()(
	"GqlRequest",
	Timeout,
	Schema.any,
	{
		token: Schema.nullish(Schema.string),
		document: Document,
		variables: Variables
	}
) {
	[PrimaryKey.symbol]() {
		return [this.document, this.variables, this.token].join(":")
	}
}

RequestResolver.fromEffectTagged<GqlRequest>()({
	GqlRequest: (reqs) => Effect.succeed(reqs.map((req) => req.variables))
})

const GqlRequestResolver = RequestResolver.fromEffect((req: GqlRequest) => {
	const headers = new Headers()
	headers.append("Content-Type", "application/json")
	headers.append("Accept", "application/json")

	if (Predicate.isString(req.token))
		headers.append("Authorization", `Bearer ${req.token.trim()}`)

	return Effect.gen(function* (_) {
		if (Date.now() / 1000 < timeout) {
			return yield* _(new Timeout({ reset: timeout }))
		}

		const response = yield* _(
			Effect.promise((signal) =>
				fetch(API_URL, {
					body: JSON.stringify({
						query: req.document,
						variables: req.variables
					}),
					headers: headers,
					method: "post",
					signal
				})
			)
		)

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
			console.error(errors)
		}

		if (errors?.length) {
			return yield* _(new Timeout({ reset: -1 }))
		}

		return data
	})
})

let timeout = 0

export const UrqlLive = Layer.effect(
	EffectUrql,
	Effect.map(Effect.serviceOption(LoaderArgs), (args) => {
		const request = Option.getOrNull(args)?.request

		const { "anilist-token": token } = cookie.parse(
			(!IS_SERVER ? globalThis.document.cookie : null) ??
				request?.headers.get("Cookie") ??
				""
		)

		return EffectUrql.of({
			query: (...args) => {
				return pipe(
					Effect.request(
						new GqlRequest({
							document: Predicate.isString(args[0]) ? args[0] : print(args[0]),
							variables: JSON.stringify(args[1]),
							token: token?.trim()
						}),
						GqlRequestResolver
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

export const ClientLoaderLive = Layer.merge(ArgsAdapterLive, UrqlLive)

class Raw<T> {
	protected opaque!: T
}

export function raw<T>(value: T): Raw<T> {
	return ["Raw", uneval(value)] as unknown as Raw<T>
}

export type Jsonify<T> =
	IsAny<T> extends true
		? any
		: T extends Raw<infer U>
			? U
			: T extends {
						toJSON(): infer U
				  }
				? U extends JsonValue
					? U
					: Jsonify<U>
				: T extends JsonPrimitive
					? T
					: T extends String
						? string
						: T extends Number
							? number
							: T extends Boolean
								? boolean
								: T extends Promise<unknown>
									? EmptyObject
									: T extends Map<unknown, unknown>
										? EmptyObject
										: T extends Set<unknown>
											? EmptyObject
											: T extends TypedArray
												? Record<string, number>
												: T extends NotJson
													? never
													: T extends []
														? []
														: T extends readonly [infer F, ...infer R]
															? [NeverToNull<Jsonify<F>>, ...Jsonify<R>]
															: T extends readonly unknown[]
																? Array<NeverToNull<Jsonify<T[number]>>>
																: T extends Record<keyof unknown, unknown>
																	? JsonifyObject<T>
																	: unknown extends T
																		? unknown
																		: never

type ValueIsNotJson<T> = T extends NotJson ? true : false
type IsNotJson<T> = {
	[K in keyof T]-?: ValueIsNotJson<T[K]>
}
type JsonifyValues<T> = {
	[K in keyof T]: Jsonify<T[K]>
}
type JsonifyObject<T extends Record<keyof unknown, unknown>> = {
	[K in keyof T as unknown extends T[K]
		? never
		: IsNotJson<T>[K] extends false
			? K
			: never]: JsonifyValues<T>[K]
} & {
	[K in keyof T as unknown extends T[K]
		? K
		: IsNotJson<T>[K] extends false
			? never
			: IsNotJson<T>[K] extends true
				? never
				: K]?: JsonifyValues<T>[K]
}
type JsonPrimitive = string | number | boolean | null
type JsonArray = JsonValue[] | readonly JsonValue[]
type JsonObject = {
	[K in string]: JsonValue
} & {
	[K in string]?: JsonValue
}
type JsonValue = JsonPrimitive | JsonObject | JsonArray
type NotJson = undefined | symbol | AnyFunction
type TypedArray =
	| Int8Array
	| Uint8Array
	| Uint8ClampedArray
	| Int16Array
	| Uint16Array
	| Int32Array
	| Uint32Array
	| Float32Array
	| Float64Array
	| BigInt64Array
	| BigUint64Array
type AnyFunction = (...args: any[]) => unknown
type NeverToNull<T> = [T] extends [never] ? null : T
declare const emptyObjectSymbol: unique symbol
export type EmptyObject = {
	[emptyObjectSymbol]?: never
}
type IsAny<T> = 0 extends 1 & T ? true : false
export {}

export type SerializeFrom<T> = T extends (...args: any[]) => infer Output
	? Serialize<Awaited<Output>>
	: Jsonify<Awaited<T>>
type Serialize<Output> =
	Output extends TypedDeferredData<infer U>
		? {
				[K in keyof U as K extends symbol
					? never
					: Promise<any> extends U[K]
						? K
						: never]: DeferValue<U[K]>
			} & Jsonify<{
				[K in keyof U as Promise<any> extends U[K] ? never : K]: U[K]
			}>
		: Output extends TypedResponse<infer U>
			? Jsonify<U>
			: Jsonify<Output>
type DeferValue<T> = T extends undefined
	? undefined
	: T extends Promise<unknown>
		? Promise<Jsonify<Awaited<T>>>
		: Jsonify<T>

export function useRawLoaderData<T>(): SerializeFrom<T> {
	return useLoaderData()
	return useMemo(
		() =>
			JSON.parse(JSON.stringify(value), (key, value) => {
				if (
					Array.isArray(value) &&
					value.length === 2 &&
					value[0] === "Raw" &&
					Predicate.isString(value[1])
				) {
					// eslint-disable-next-line no-eval
					return (0, eval)(`(${value[1]})`)
				}
				return value
			}) as SerializeFrom<T>,
		[value]
	)
}

export function useRawRouteLoaderData<T>(
	...args: Parameters<typeof useRouteLoaderData>
): SerializeFrom<T> | undefined {
	return useRouteLoaderData(...args)
	return useMemo(
		() =>
			JSON.parse(JSON.stringify(value), (key, value) => {
				if (
					Array.isArray(value) &&
					value.length === 2 &&
					value[0] === "Raw" &&
					Predicate.isString(value[1])
				) {
					// eslint-disable-next-line no-eval
					return (0, eval)(`(${value[1]})`)
				}
				return value
			}) as SerializeFrom<T>,
		[value]
	)
}
