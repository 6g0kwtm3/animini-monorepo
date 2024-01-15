import cookie from "cookie"

import type { LoaderFunctionArgs } from "@remix-run/node"
import type { ClientLoaderFunctionArgs, Params } from "@remix-run/react"

import {
	Context,
	Data,
	Effect,
	Layer,
	Predicate,
	Request,
	RequestResolver,
	pipe,
} from "effect"

import { IS_SERVER } from "./isClient"

import type { TypedDocumentNode } from "@graphql-typed-document-node/core"
import { print } from "graphql"

const API_URL = "https://graphql.anilist.co"

export class GqlRequest<R, V> extends Request.TaggedClass("GqlRequest")<
	ClientNetworkError,
	R,
	{
		document: TypedDocumentNode<R, V>
		requestHeaders?: Headers
		signal?: AbortSignal
		variables: V
	}
> {}

class ClientNetworkError extends Data.TaggedError("ClientNetworkError")<{
	reason: string
	error: unknown
}> {}

export const ResolveGqlRequest = pipe(
	RequestResolver.fromEffect((req: GqlRequest<any, any>) => {
		return pipe(
			Effect.promise(() =>
				fetch(API_URL, {
					body: JSON.stringify({
						query: print(req.document),
						variables: req.variables,
					}),
					headers: req.requestHeaders,
					method: "post",
					signal: req.signal,
				}),
			),

			// Effect.filterOrDie(reponse=>reponse.ok, ()=> new Error()),
			// Effect.tapBoth({onFailure:Console.error,onSuccess:Console.log}),

			Effect.flatMap((response) => Effect.promise(() => response.json())),
			Effect.map(({ data }) => data),
			// Effect.tap(Console.log),

			// Effect.tryPromise({
			// 	try: (signal) => client.request(req.args),
			// 	catch: (error) => new ClientNetworkError({ error, reason: "Client" }),
			// }),

			// Http.request.post(API_URL, {
			// 	acceptJson: true,
			// 	body: Http.body.raw(
			// 		JSON.stringify({
			// 			query: print(req.operation),
			// 			variables: req.variables,
			// 		}),
			// 	),
			// }),
			// pipe(
			// 	Http.client.fetchOk(),
			// 	Http.client.catchAll(
			// 		(e) => new ClientNetworkError({ error: e, reason: "HttpClient" }),
			// 	),
			// ),
			// Effect.flatMap(Http.response.schemaBodyJson(unknown)),
			// Effect.catchTags({
			// 	ParseError: (error) =>
			// 		new ClientNetworkError({ error, reason: "Parse" }),
			// 	ResponseError: (error) =>
			// 		new ClientNetworkError({ error, reason: "Response" }),
			// }),
		)
	}),
)

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

class NetworkError extends Error {
	_tag = "Network"
}

type Result<Data> = Effect.Effect<never, NetworkError, Data | undefined>

type Args<Data, Variables> = [
	query: TypedDocumentNode<Data, Variables>,
	variables: Variables,
]

interface EffectUrql {
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

const UrqlLive = Layer.effect(
	EffectUrql,
	Effect.map(LoaderArgs, ({ request }) => {
		return EffectUrql.of({
			query: (...args) => {
				const headers = new Headers()
				headers.append("Content-Type", "application/json")

				const { "anilist-token": token } = cookie.parse(
					(!IS_SERVER ? globalThis.document.cookie : null) ??
						request.headers.get("Cookie") ??
						"",
				)

				if (Predicate.isString(token))
					headers.append("Authorization", `Bearer ${token.trim()}`)

				return pipe(
					Effect.request(
						new GqlRequest({
							document: args[0],
							variables: args[1],
							requestHeaders: headers,
							signal: request.signal,
						}),
						ResolveGqlRequest,
					),
					Effect.withRequestCaching(true),
				)
			},
			mutation: (...args) => {
				throw new Error("Not implemented")
			},
		})
	}),
)

export const ArgsAdapterLive = Layer.effect(
	ClientArgs,
	Effect.map(LoaderArgs, ({ params, request }) => {
		return ClientArgs.of({
			params,
			searchParams: new URL(request.url).searchParams,
		})
	}),
)

export const LoaderLive = Layer.merge(ArgsAdapterLive, UrqlLive)

export const ClientLoaderLive = Layer.merge(ArgsAdapterLive, UrqlLive)
