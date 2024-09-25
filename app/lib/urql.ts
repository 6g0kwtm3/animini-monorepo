import { type ClientLoaderFunctionArgs, type Params } from "@remix-run/react"

import { Context, Effect, Layer } from "effect"

import { Schema } from "@effect/schema"

import type {
	CacheConfig,
	FetchQueryFetchPolicy,
	GraphQLTaggedNode,
	MutationConfig,
	MutationParameters,
	OperationType,
	Variables,
} from "relay-runtime"

import { commitMutation, fetchQuery, loadQuery } from "./Network"

export type JSONValue = string | number | boolean | JSONObject | JSONArray

export interface JSONObject {
	[x: string]: JSONValue
}

interface JSONArray extends Array<JSONValue> {}

export class LoaderArgs extends Context.Tag("loader(args)")<
	LoaderArgs,
	ClientLoaderFunctionArgs
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
	reset: Schema.String,
}) {}

const makeClientLive = Effect.sync(() => {
	return {
		query: <T extends OperationType>(
			taggedNode: GraphQLTaggedNode,
			variables: Variables,
			cacheConfig?: {
				networkCacheConfig?: CacheConfig | null | undefined
				fetchPolicy?: FetchQueryFetchPolicy | null | undefined
			} | null
		) =>
			Effect.promise(async () =>
				fetchQuery<T>(taggedNode, variables, cacheConfig).toPromise()
			),
		loadQuery: <T extends OperationType>(
			taggedNode: GraphQLTaggedNode,
			variables: Variables,
			cacheConfig?:
				| {
						networkCacheConfig?: CacheConfig | null | undefined
						fetchPolicy?: FetchQueryFetchPolicy | null | undefined
				  }
				| undefined
		) =>
			Effect.promise(async () =>
				loadQuery<T>(taggedNode, variables, cacheConfig)
			),
		mutation: <T extends MutationParameters>(config: MutationConfig<T>) =>
			Effect.async<T["response"], Error>((resume) => {
				commitMutation<T>({
					...config,
					onCompleted: (value) => resume(Effect.succeed(value)),
					onError: (error) => resume(Effect.fail(error)),
				})
			}),
	}
})

export const ArgsAdapterLive = Layer.effect(
	ClientArgs,
	Effect.map(LoaderArgs, ({ params, request }) => {
		return ClientArgs.of({
			params,
			searchParams: new URL(request.url).searchParams,
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
