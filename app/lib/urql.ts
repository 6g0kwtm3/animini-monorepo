import { authExchange } from "@urql/exchange-auth"
import { cacheExchange, offlineExchange } from "@urql/exchange-graphcache"
import { makeDefaultStorage } from "@urql/exchange-graphcache/default-storage"
import type {
	AnyVariables,
	DocumentInput,
	Exchange,
	OperationContext,
	OperationResult,
	SSRData,
	TypedDocumentNode,
} from "urql"
import { Client, fetchExchange, ssrExchange } from "urql"
import { graphql } from "~/gql"
import type { GraphCacheConfig } from "../gql/graphql"

import introspection from "~/gql/introspection.json"

import cookie from "cookie"

import type { LoaderFunctionArgs } from "@remix-run/node"
import type { ClientLoaderFunctionArgs, Params } from "@remix-run/react"

import {
	Chunk,
	Context,
	Data,
	Effect,
	Either,
	Layer,
	Predicate,
	Request,
	RequestResolver,
	Stream,
	pipe,
} from "effect"

import * as wonka from "wonka"
import { IS_SERVER } from "./isClient"

import { print } from "graphql"
import type { RequestOptions, Variables } from "graphql-request"
import { GraphQLClient } from "graphql-request"

export const ssr = ssrExchange({
	isClient: !IS_SERVER,
	...(!IS_SERVER ? { initialState: window.__URQL_DATA__ } : {}),
})

const graphcacheConfig = {
	introspection,
	updates: {
		Mutation: {
			ToggleFavourite(result, arguments_, cache) {
				if (!arguments_.animeId || !result.ToggleFavourite?.anime?.nodes) {
					return
				}

				const isFavourite = result.ToggleFavourite.anime.nodes.some(
					(anime) => anime?.id === arguments_.animeId,
				)

				cache.writeFragment(
					graphql(/* GraphQL */ `
						fragment cache_updates_Mutation_ToggleFavourite on Media {
							id
							isFavourite
						}
					`),
					{
						id: arguments_.animeId,
						isFavourite,
					},
				)
			},
		},
	},
	optimistic: {
		ToggleFavourite(arguments_, cache, info) {
			const isFavourite = info.variables["isFavourite"]

			const nodes = isFavourite
				? []
				: [
						{
							id: arguments_.animeId,
							__typename: "Media",
							isFavourite: true,
							isFavouriteBlocked: false,
						},
					]

			return {
				__typename: "Favourites",
				...(Predicate.isNumber(arguments_.animeId) && {
					anime: {
						__typename: "MediaConnection",
						nodes: nodes,
					},
				}),
			}
		},
	},
	keys: {
		MediaTitle: () => null,
		MediaCoverImage: () => null,
		PageInfo: () => null,
		// Page: (data) => Object.keys(data).join(':'),
		Page: () => null,
		FuzzyDate: () => null,
		MediaListTypeOptions: () => null,
		MediaListOptions: () => null,
		UserAvatar: () => null,
		MediaListGroup: () => null,
		MediaListCollection: (collection) =>
			collection.user?.id
				? "id" + collection.user.id
				: collection.user?.name
					? "name" + collection.user.name
					: null,
	},
} satisfies GraphCacheConfig

export const exchanges: Exchange[] = []

if (!IS_SERVER) {
	const storage = makeDefaultStorage()

	exchanges.push(
		offlineExchange<GraphCacheConfig>(Object.assign(graphcacheConfig, {})),
		authExchange(async (utils) => {
			return {
				addAuthToOperation(operation) {
					const { "anilist-token": token } = cookie.parse(document.cookie)
					if (!token) return operation
					return utils.appendHeaders(operation, {
						Authorization: `Bearer ${token}`,
					})
				},
				willAuthError(token) {
					return false
				},
				didAuthError(error, _operation) {
					return error.graphQLErrors.some((e) =>
						e.message.includes("Invalid token"),
					)
				},
				async refreshAuth() {
					document.cookie = ""
					logout()
				},
			}
		}),
		fetchExchange,
	)
	exchanges.push(ssr, fetchExchange)
}

function logout() {
	console.log("logout")
}

const API_URL = "https://graphql.anilist.co"

export class GqlRequest<R, V extends Variables> extends Request.TaggedClass(
	"GqlRequest",
)<ClientNetworkError, R, { args: RequestOptions<V, R> }> {}

class ClientNetworkError extends Data.TaggedError("ClientNetworkError")<{
	reason: string
	error: unknown
}> {}

const client = new GraphQLClient(API_URL, {
	errorPolicy: "ignore",
	// signal,
})

export const ResolveGqlRequest = pipe(
	RequestResolver.fromEffect((req: GqlRequest<any, any>) => {
		return pipe(
			Effect.promise(() =>
				client.rawRequest(
					print(req.args.document),
					req.args.variables,
					req.args.requestHeaders,
				),
			),
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

declare global {
	interface Window {
		__URQL_DATA__: SSRData
	}
}

export const urql = new Client({
	url: API_URL,
	exchanges: exchanges,
	requestPolicy: "cache-first",
})

let cache = new WeakMap<Request, Client>()

export function getClient(request: Request) {
	let client = cache.get(request)
	if (client) {
		return client
	}
	client = createStatelessClient(request)
	cache.set(request, client)
	return client
}

function createStatelessClient(request: Request) {
	const exchanges = []

	exchanges.push(
		cacheExchange<GraphCacheConfig>(graphcacheConfig),
		authExchange(async (utils) => {
			return {
				addAuthToOperation(operation) {
					const { "anilist-token": token } = cookie.parse(
						request.headers.get("Cookie") ?? "",
					)
					if (!token) return operation

					return utils.appendHeaders(operation, {
						Authorization: `Bearer ${token}`,
					})
				},
				willAuthError(token) {
					return false
				},
				didAuthError(error, _operation) {
					return error.graphQLErrors.some((e) =>
						e.message.includes("Unauthorized"),
					)
				},
				async refreshAuth() {},
			}
		}),
		fetchExchange,
	)
	exchanges.push(ssr, fetchExchange)

	return new Client({
		url: API_URL,
		exchanges: exchanges,
	})
}

export function nonNull<T>(value: T): value is NonNullable<T> {
	return value !== undefined && value !== null
}

export type JSONValue = string | number | boolean | JSONObject | JSONArray

interface JSONObject {
	[x: string]: JSONValue
}

interface JSONArray extends Array<JSONValue> {}

export type InferVariables<T> = T extends TypedDocumentNode<any, infer V>
	? V
	: never

class NetworkError extends Error {
	_tag = "Network"
}

type Result<Data> = Stream.Stream<never, NetworkError, Data | undefined>

type Args<Data, Variables extends AnyVariables> = [
	query: DocumentInput<Data, Variables>,
	variables: Variables,
	context?: Partial<OperationContext>,
]

interface EffectUrql {
	query<Data = any, Variables extends AnyVariables = AnyVariables>(
		...args: Args<Data, Variables>
	): Result<Data>
	mutation<Data = any, Variables extends AnyVariables = AnyVariables>(
		...args: Args<Data, Variables>
	): Result<Data>
}

export const EffectUrql = Context.Tag<EffectUrql>("Urql")
export const LoaderArgs = Context.Tag<
	LoaderFunctionArgs | ClientLoaderFunctionArgs
>("loader(args)")
export const UrqlClient = Context.Tag<Client>("UrqlClient")

type Arguments = {
	params: Readonly<Params<string>>
	searchParams: URLSearchParams
}

export const ClientArgs = Context.Tag<Arguments>("client/Args")

export function StreamFromSource<T>(source: wonka.Source<T>) {
	return Stream.asyncInterrupt<never, never, T>((emit) => {
		const { unsubscribe } = wonka.pipe(
			source,
			wonka.subscribe((result) => {
				emit(Effect.succeed(Chunk.of(result)))
			}),
		)
		return Either.left(Effect.sync(unsubscribe))
	})
}

function streamFromResult<Data, Variables extends AnyVariables = AnyVariables>(
	result: OperationResult<Data, Variables>,
) {
	if (result.error?.networkError) {
		return Stream.fail(
			new NetworkError(result.error.networkError.message, {
				cause: result.error.networkError.cause,
			}),
		)
	}

	// if (result.error?.graphQLErrors.length) {
	// 	console.error(print(result.operation.query), ...result.error?.graphQLErrors)
	// }

	return Stream.succeed(result.data)
}

const UrqlLive = Layer.effect(
	EffectUrql,
	Effect.map(LoaderArgs, ({ request }) => {
		return EffectUrql.of({
			query: (...args) => {
				const headers = new Headers()

				const { "anilist-token": token } = cookie.parse(
					globalThis.document?.cookie ?? request.headers.get("Cookie") ?? "",
				)

				if (Predicate.isString(token))
					headers.append("Authorization", `Bearer ${token.trim()}`)
				console.log({ token: typeof token })

				return pipe(
					// StreamFromSource(client.query(...args)),
					// Stream.flatMap(streamFromResult),
					Effect.request(
						new GqlRequest({
							args: {
								document: args[0],
								variables: args[1],
								requestHeaders: headers,
								signal: request.signal,
							},
						}),
						ResolveGqlRequest,
					),
					Effect.withRequestCaching(true),
					Stream.fromEffect,
				)
			},
			mutation: (...args) =>
				pipe(
					StreamFromSource(client.mutation(...args)),
					Stream.flatMap(streamFromResult),
				),
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

const GetUrqlLive = Layer.effect(
	UrqlClient,
	Effect.map(LoaderArgs, ({ request }) => UrqlClient.of(getClient(request))),
)

const GetClientUrqlLive = Layer.succeed(UrqlClient, urql)

export const LoaderLive = Layer.merge(
	ArgsAdapterLive,
	UrqlLive.pipe(Layer.provide(GetUrqlLive)),
)

export const ClientLoaderLive = Layer.merge(
	ArgsAdapterLive,
	UrqlLive.pipe(Layer.provide(GetClientUrqlLive)),
)
