import { authExchange } from "@urql/exchange-auth"
import { cacheExchange, offlineExchange } from "@urql/exchange-graphcache"
import { makeDefaultStorage } from "@urql/exchange-graphcache/default-storage"
import type {
	AnyVariables,
	DocumentInput,
	Exchange,
	OperationContext,
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
import { useParams, useSearchParams } from "@remix-run/react"

import { useMemo, useSyncExternalStore } from "react"

import {
	Chunk,
	Context,
	Effect,
	Either,
	Fiber,
	Layer,
	Predicate,
	ReadonlyArray,
	Stream,
	pipe,
} from "effect"

import type { FieldNode, SelectionNode } from "graphql"
import {
	Kind,
	TypeInfo,
	buildASTSchema,
	isNonNullType,
	isScalarType,
	parse,
	print,
	visit,
	visitWithTypeInfo,
} from "graphql"
import * as wonka from "wonka"
import { IS_SERVER } from "./isClient"

import { mergeTypeDefs } from "@graphql-tools/merge"
import mainfile from "~/../schema.graphql?raw"
import typeDefs from "~/schema/.schema.graphql?raw"
import { resolvers } from "~/schema/resolvers"

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
			const { "anilist-token": token } = cookie.parse(document.cookie)

			return {
				addAuthToOperation(operation) {
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
				async refreshAuth() {
					// document.cookie = ""
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

function dedupe(
	selections: readonly SelectionNode[],
): readonly SelectionNode[] {
	const { "...rest": rest = [], ...fields } = ReadonlyArray.groupBy(
		selections,
		(node) => (node.kind === Kind.FIELD ? node.name.value : "...rest"),
	)

	return [
		...rest,
		...Object.entries(
			fields as Record<string, [FieldNode, ...FieldNode[]]>,
		).map(([, values]) => {
			return values.reduce((a, b) => ({
				...a,
				...b,
				...(a.selectionSet &&
					b.selectionSet && {
						selectionSet: {
							...a.selectionSet,
							...b.selectionSet,
							selections: [
								...a.selectionSet.selections,
								...b.selectionSet.selections,
							],
						},
					}),
			}))
		}),
	]
}

function doStuff(
	typeInfo: TypeInfo,
	selections: readonly SelectionNode[],
): readonly SelectionNode[] {
	return selections.flatMap((node) => {
		typeInfo.enter(node)

		const def = typeInfo.getFieldDef()

		if (
			isNonNullType(def?.type) &&
			isScalarType(def.type.ofType) &&
			def.type.ofType?.astNode?.directives?.some(
				(dir) => dir.name.value === "component",
			)
		) {
			const selections = parse(
				resolvers[typeInfo.getParentType()?.name][node.name.value]["selectionSet"],
			).definitions[0].selectionSet.selections

			typeInfo.leave(node)
			return [
				{ kind: Kind.FIELD, name: { kind: Kind.NAME, value: "__typename" } },
				...doStuff(typeInfo, selections),
			]
		}

		typeInfo.leave(node)
		return [
			{ kind: Kind.FIELD, name: { kind: Kind.NAME, value: "__typename" } },
			node,
		]
	})
}

const schema = buildASTSchema(mergeTypeDefs([mainfile, typeDefs]))
const componentExchange: Exchange = ({ client, forward }) => {
	return (operations$) => {
		// <-- The ExchangeIO function
		const operationResult$ = forward(
			wonka.pipe(
				operations$,
				wonka.map((operation) => {
					const typeInfo = new TypeInfo(schema)

					const visitor = visitWithTypeInfo(typeInfo, {
						SelectionSet(selectionSet) {
							return {
								...selectionSet,
								selections: dedupe(doStuff(typeInfo, selectionSet.selections)),
							}
						},
					})

					const query = visit(operation.query, visitor)

					console.log(print(query))

					return {
						...operation,
						query,
						extensions: {
							...operation.extensions,
							__original_query__: operation.query,
						},
					}
				}),
			),
		)

		return wonka.pipe(
			operationResult$,
			wonka.tap((result) => {
				if (result.operation.extensions?.["__original_query__"]) {
					patchData(result)
				}

				// console.log(result.data.MediaListCollection)

				return result
			}),
		)
	}
}

function patchData(result) {
	let stack = [[result.data]]
	const typeInfo = new TypeInfo(schema)

	const visitor = visitWithTypeInfo(typeInfo, {
		Field: {
			enter(node) {
				stack.push(
					stack
						.at(-1)
						.flatMap(
							(data) => data?.[node.alias?.value ?? node.name.value] ?? [],
						),
				)
			},
			leave() {
				stack.pop()
			},
		},
		SelectionSet: {
			enter(selectionSet) {
				for (const node of selectionSet.selections) {
					if(node.kind !== Kind.FIELD){
						continue
					}

					typeInfo.enter(node)
					const def = typeInfo.getFieldDef()

					if (
						isNonNullType(def?.type) &&
						isScalarType(def.type.ofType) &&
						def.type.ofType?.astNode?.directives?.some(
							(dir) => dir.name.value === "component",
						)
					) {
						for (const data of stack.at(-1)) {
							if (data?.__typename) {
								data[node.name.value] = resolvers[data.__typename][
									node.name.value
								].resolve(
									data,
									// patchData({
									// 	data,
									// 	operation: {
									// 		extensions: {
									// 			__original_query__: parse(
									// 				`fragment _ on ${data.__typename} ${
									// 					resolvers[data.__typename][def.name]["selectionSet"]
									// 				}`,
									// 			),
									// 		},
									// 	},
									// }),
								)
							}
						}
					}

					typeInfo.leave(node)
				}
				return selectionSet
			},
			leave() {},
		},
	})

	visit(result.operation.extensions.__original_query__, visitor)
}

function createStatelessClient(request: Request) {
	const exchanges = []

	exchanges.push(
		componentExchange,
		cacheExchange<GraphCacheConfig>(graphcacheConfig),
		authExchange(async (utils) => {
			const { "anilist-token": token } = cookie.parse(
				request.headers.get("Cookie") ?? "",
			)

			return {
				addAuthToOperation(operation) {
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
				async refreshAuth() {
					throw new Error("Unauthorized")
				},
			}
		}),
		fetchExchange,
	)
	// exchanges.push(ssr, fetchExchange)

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

interface EffectUrql {
	query<Data = any, Variables extends AnyVariables = AnyVariables>(
		query: DocumentInput<Data, Variables>,
		variables: Variables,
		context?: Partial<OperationContext>,
	): Stream.Stream<never, Error, Data | undefined>
	mutation<Data = any, Variables extends AnyVariables = AnyVariables>(
		mutation: DocumentInput<Data, Variables>,
		variables: Variables,
		context?: Partial<OperationContext>,
	): Stream.Stream<never, Error, Data | undefined>
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

const UrqlLive = Layer.effect(
	EffectUrql,
	Effect.map(UrqlClient, (client) => {
		return EffectUrql.of({
			query: <Data = any, Variables extends AnyVariables = AnyVariables>(
				query: DocumentInput<Data, Variables>,
				variables: Variables,
				context?: Partial<OperationContext>,
			): Stream.Stream<never, Error, Data | undefined> =>
				pipe(
					StreamFromSource(client.query(query, variables)),
					Stream.flatMap((result) => {
						if (result.error?.networkError) {
							return Stream.fail(result.error.networkError)
						}
						return Stream.succeed(result.data)
					}),
				),
			mutation: <Data = any, Variables extends AnyVariables = AnyVariables>(
				mutation: DocumentInput<Data, Variables>,
				variables: Variables,
				context?: Partial<OperationContext>,
			): Stream.Stream<never, Error, Data | undefined> =>
				pipe(
					StreamFromSource(client.mutation(mutation, variables)),
					Stream.flatMap((result) => {
						if (result.error?.networkError) {
							return Stream.fail(result.error.networkError)
						}
						return Stream.succeed(result.data)
					}),
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
