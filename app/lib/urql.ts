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
import { Client, fetchExchange, ssrExchange, useClient } from "urql"
import { graphql } from "~/gql"
import type { GraphCacheConfig } from "../gql/graphql"

import introspection from "~/gql/introspection.json"

import cookie from "cookie"

import type { LoaderFunctionArgs } from "@remix-run/node"
import type { ClientLoaderFunctionArgs, Params } from "@remix-run/react"
import { useLoaderData, useParams, useSearchParams } from "@remix-run/react"

import { useMemo, useSyncExternalStore } from "react"

import {
	Chunk,
	Context,
	Effect,
	Either,
	Fiber,
	Layer,
	Predicate,
	Stream,
	pipe,
} from "effect"

import * as wonka from "wonka"
import { IS_SERVER } from "./isClient"

import { uneval } from "devalue"

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

export function useLoader<E, A>(
	_loader: Stream.Stream<EffectUrql | Arguments, E, A>,
	initialData: A,
) {
	return initialData;
	
	const params = useParams()
	const [searchParams] = useSearchParams()

	const client = useClient()

	const store = useMemo(() => {
		let listeners: (() => void)[] = []
		let state = initialData
		let cleanup = () => {}

		return {
			getSnapshot: () => state,
			subscribe: (listener: () => void) => {
				if (listeners.length === 0) {
					const fiber = pipe(
						_loader,

						Stream.runForEach((data) =>
							Effect.sync(() => {
								if (data === state) {
									return
								}
								state = data
								for (const listener of listeners) {
									listener()
								}
							}),
						),
						Effect.provide(UrqlLive),
						Effect.provideService(UrqlClient, client),
						Effect.provideService(ClientArgs, {
							params: params,
							searchParams: searchParams,
						}),
						Effect.runFork,
					)

					cleanup = () => {
						Effect.runPromise(Fiber.interrupt(fiber))
					}
				}
				listeners.push(listener)
				return () => {
					listeners = listeners.filter((l) => l !== listener)
					if (listeners.length === 0) {
						cleanup()
					}
				}
			},
		}
	}, [client, params, searchParams, _loader, initialData])

	return useSyncExternalStore(
		store.subscribe,
		store.getSnapshot,
		store.getSnapshot,
	)
}

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
	Effect.map(UrqlClient, (client) => {
		return EffectUrql.of({
			query: (...args) =>
				pipe(
					StreamFromSource(client.query(...args)),
					Stream.flatMap(streamFromResult),
				),
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



type RawValue<T> = T extends Raw<infer U> ? U : unknown

export type SerializeFrom<T> = T extends (...args: any[]) => infer Output
	? RawValue<Awaited<Output>>
	: RawValue<T>

abstract class Raw<T> {
	value!: T
}

export function raw<T>(value: T): Raw<T> {
	return uneval(value) as unknown as Raw<T>
}

export function useRawLoaderData<T = unknown>() {
	const data = useLoaderData()

	// eslint-disable-next-line no-eval
	return useMemo(() => (0, eval)(`(${data})`) as SerializeFrom<T>, [data])
}
