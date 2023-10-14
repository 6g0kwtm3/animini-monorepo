import { devtoolsExchange } from "@urql/devtools"
import { authExchange } from "@urql/exchange-auth"
import {
  offlineExchange as cacheExchange,
  offlineExchange,
} from "@urql/exchange-graphcache"
import { makeDefaultStorage } from "@urql/exchange-graphcache/default-storage"
import type { AnyVariables, UseQueryArgs } from "urql"
import { Client, fetchExchange, useQuery } from "urql"
import { graphql } from "~/gql"
import type { GraphCacheConfig } from "../gql/graphql"

import introspection from "~/gql/introspection.json"

import cookie from "cookie"

import { refocusExchange } from "@urql/exchange-refocus"

const graphcacheConfig = {
  updates: {
    Mutation: {
      ToggleFavourite(result, args, cache) {
        if (!args.animeId || !result.ToggleFavourite?.anime?.nodes) {
          return
        }

        const isFavourite = result.ToggleFavourite.anime.nodes.some(
          (anime) => anime?.id === args.animeId
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
          }
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
        ...(args.animeId && {
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

const exchanges = [devtoolsExchange, refocusExchange()]

if (typeof document !== "undefined") {
  const storage = makeDefaultStorage()

  exchanges.push(
    offlineExchange<GraphCacheConfig>(
      Object.assign(graphcacheConfig, { storage, introspection })
    )
  )

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
            e.message.includes("Unauthorized")
          )
        },
        async refreshAuth() {
          document.cookie = ""
          logout()
        },
      }
    })
  )
  exchanges.push(fetchExchange)
}

function logout() {
  console.log("logout")
}

const URL = "https://graphql.anilist.co"

export const urql = new Client({
  url: URL,
  exchanges: exchanges,
  requestPolicy: "cache-and-network",
})

// let once = new WeakSet()

export function useLoadedQuery<V extends AnyVariables, D>(
  args: UseQueryArgs<V, D>,
  initialData: D
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
        request.headers.get("Cookie") ?? ""
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
            e.message.includes("Unauthorized")
          )
        },
        async refreshAuth() {
          throw new Error("Unauthorized")
        },
      }
    })
  )
  exchanges.push(fetchExchange)

  return new Client({
    url: URL,
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
