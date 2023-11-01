import { authExchange } from "@urql/exchange-auth"
import {
  offlineExchange as cacheExchange,
  offlineExchange,
} from "@urql/exchange-graphcache"
import { makeDefaultStorage } from "@urql/exchange-graphcache/default-storage"
import { requestPolicyExchange } from "@urql/exchange-request-policy"
import type {
  AnyVariables,
  DocumentInput,
  Exchange,
  OperationContext,
  TypedDocumentNode,
  UseQueryArgs,
} from "urql"
import { Client, fetchExchange, useClient, useQuery } from "urql"
import { graphql } from "~/gql"
import type { GraphCacheConfig } from "../gql/graphql"

import introspection from "~/gql/introspection.json"

import cookie from "cookie"

import { refocusExchange } from "@urql/exchange-refocus"

import type { LoaderFunctionArgs } from "@remix-run/node"
import type { Params } from "@remix-run/react"
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
  Stream,
  pipe,
} from "effect"

import * as wonka from "wonka"

const graphcacheConfig = {
  updates: {
    Mutation: {
      ToggleFavourite(result, args, cache) {
        if (!args.animeId || !result.ToggleFavourite?.anime?.nodes) {
          return
        }

        const isFavourite = result.ToggleFavourite.anime.nodes.some(
          (anime) => anime?.id === args.animeId,
        )

        cache.writeFragment(
          graphql(/* GraphQL */ `
            fragment cache_updates_Mutation_ToggleFavourite on Media {
              id
              isFavourite
            }
          `),
          {
            id: args.animeId,
            isFavourite,
          },
        )
      },
    },
  },
  optimistic: {
    ToggleFavourite(args, cache, info) {
      const isFavourite = info.variables["isFavourite"]

      const nodes = !isFavourite
        ? [
            {
              id: args.animeId,
              __typename: "Media",
              isFavourite: true,
              isFavouriteBlocked: false,
            },
          ]
        : []

      return {
        __typename: "Favourites",
        ...(Predicate.isNumber(args.animeId) && {
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

const exchanges: Exchange[] = [refocusExchange(), requestPolicyExchange({})]

if (typeof document !== "undefined") {
  const storage = makeDefaultStorage()

  exchanges.push(
    offlineExchange<GraphCacheConfig>(
      Object.assign(graphcacheConfig, { storage, introspection }),
    ),
  )

  // exchanges.push(
  //   mapExchange({
  //     onOperation(operation) {
  //       const { requestPolicy } = operation.context

  //       operation.query = visit(operation.query, {
  //         Field(node) {
  //           if (
  //             node.directives?.some(
  //               (directive) => directive.name.value === "_requestPolicy"
  //             )
  //           ) {
  //             console.log(node)
  //           }
  //           return node
  //         },
  //       })

  //       return operation
  //     },
  //   })
  // )

  exchanges.push(
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
          document.cookie = ""
          logout()
        },
      }
    }),
  )
  exchanges.push(fetchExchange)
}

function logout() {
  console.log("logout")
}

const API_URL = "https://graphql.anilist.co"

export const urql = new Client({
  url: API_URL,
  exchanges: exchanges,
})

// let once = new WeakSet()

export function useLoadedQuery<V extends AnyVariables, D>(
  args: UseQueryArgs<V, D>,
  initialData: D,
) {
  const [state, execute] = useQuery({
    ...args,
    ...(typeof document === "undefined" ? { pause: true } : {}),
    // context: useMemo(
    //   () => ({
    //     fetch: (...args2) => {
    //       if (!once.has(args.query)) {
    //         once.add(args.query)

    //         console.log(args2[1], initialData)

    //         return Promise.resolve(
    //           new Response(JSON.stringify({ data: initialData }), {
    //             headers: {
    //               "Content-Type": "application/json",
    //             },
    //             status: 200,
    //           })
    //         )
    //       }
    //       return fetch(...args2)
    //     },
    //   }),
    //   []
    // ),
  })

  return [{ ...state, data: state.data ?? initialData }, execute] as const
}

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

  exchanges.push(cacheExchange<GraphCacheConfig>(graphcacheConfig))

  exchanges.push(
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
  )
  exchanges.push(fetchExchange)

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
  _loader: Stream.Stream<EffectUrql | Args, E, A>,
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
        if (!listeners.length) {
          const fiber = pipe(
            _loader,
            Stream.runForEach((data) =>
              Effect.sync(() => {
                state = data
                for (const listener of listeners) {
                  listener()
                }
              }),
            ),
            Effect.provide(UrqlLive),
            Effect.provideService(UrqlClient, client),
            Effect.provideService(ClientArgs, {
              params,
              searchParams,
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
          if (!listeners.length) {
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
export const LoaderArgs = Context.Tag<LoaderFunctionArgs>("loader(args)")
export const UrqlClient = Context.Tag<Client>("UrqlClient")

type Args = {
  params: Readonly<Params<string>>
  searchParams: URLSearchParams
}

export const ClientArgs = Context.Tag<Args>("client/Args")

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

export const ServerLive = Layer.merge(
  GetUrqlLive.pipe(Layer.provide(UrqlLive)),
  ArgsAdapterLive,
)
