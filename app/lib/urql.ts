import cookie from "cookie"

import type {
	LoaderFunctionArgs,
	TypedDeferredData,
	TypedResponse,
} from "@remix-run/node"
import {
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
	ReadonlyArray,
	RequestResolver,
	pipe
} from "effect"

import { IS_SERVER } from "./isClient"

import type { TypedDocumentNode } from "@graphql-typed-document-node/core"
import {
	parse,
	print
} from "graphql"

import { uneval } from "devalue"

import { Schema } from "@effect/schema"

import { buildHTTPExecutor } from "@graphql-tools/executor-http"
import { stitchSchemas } from "@graphql-tools/stitch"

import { makeExecutableSchema } from "@graphql-tools/schema"

import mainfile from "~/../schema.graphql?raw"


import { delegateToSchema } from "@graphql-tools/delegate"
import { TransformObjectFields } from "@graphql-tools/wrap"

const API_URL = "https://graphql.anilist.co/"

class ClientNetworkError extends Data.TaggedError("ClientNetworkError")<{
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

const Document = Schema.transform(Schema.any, Schema.string, print, (query) =>
	parse(query),
)

class GqlRequest extends Schema.TaggedRequest<GqlRequest>()(
	"GqlRequest",
	Schema.any,
	Schema.any,
	{
		token: Schema.string,
		document: Document,
		variables: Schema.any,
	},
) {
	[PrimaryKey.symbol]() {
		return this.document + JSON.stringify(this.variables)
	}
}

RequestResolver.fromEffectTagged<GqlRequest>()({
	GqlRequest: (reqs) =>
		Effect.succeed(ReadonlyArray.map(reqs, (req) => req.id)),
})

const UrqlLive = Layer.effect(
	EffectUrql,
	Effect.map(Effect.serviceOption(LoaderArgs), (args) => {
		const request = Option.getOrElse(args, () => null)?.request

		return EffectUrql.of({
			query: (...args) => {
				const headers = new Headers()
				headers.append("Content-Type", "application/json")

				const { "anilist-token": token } = cookie.parse(
					(!IS_SERVER ? globalThis.document.cookie : null) ??
						request?.headers.get("Cookie") ??
						"",
				)

				if (Predicate.isString(token))
					headers.append("Authorization", `Bearer ${token.trim()}`)

				return pipe(
					// Effect.async((resolve) => {
					// 	request.signal.addEventListener("abort", () =>
					// 		resolve(Effect.interrupt),
					// 	)
					// }),
					// Effect.race(
					Effect.promise(() =>
						fetch(${API_URL}, {
							body: JSON.stringify({
								query: print(args[0]),
								variables: args[1],
							}),
							headers: headers,
							method: "post",
							signal: request?.signal,
						}),
					),
					// ),

					Effect.flatMap((response) => Effect.promise(() => response.json())),

					Effect.map(({ data }) => data),
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

class Raw<T> {
	protected opaque!: T
}

export function raw<T>(value: T): Raw<T> {
	return uneval(value) as unknown as Raw<T>
}

type Jsonify<T> = T

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

const mainschema = {
	schema: makeExecutableSchema({
		typeDefs: mainfile,
	}),
	batch: true,
	executor: buildHTTPExecutor({
		endpoint: "https://graphql.anilist.co/",
	}),
	transforms: [
		new TransformObjectFields((typeName, fieldName, fieldConfig) =>
			names.includes(typeName) && fieldName === "id"
				? [`anilistId`, fieldConfig]
				: [fieldName, fieldConfig],
		),
	],
}

const names = [
	"Media",
	"AiringSchedule",
	"Character",
	"Staff",
	"MediaList",
	"User",
	"Studio",
	"Review",
	"Activity",
	"ActivityReply",
	"Thread",
	"Recommendation",
]

const Node = {
	id(parent, args, ctx, info) {
		return Buffer.from(
			`${names.indexOf(info.parentType.name)}:${parent.id}`,
		).toString("base64")
	},
}

export const schema = stitchSchemas({
	subschemas: [mainschema],
	resolvers: {
		...Object.fromEntries(names.map((name) => [name, Node])),
		Query: {
			node(_, args, ctx, info) {
				const [i, id] = Buffer.from(args.id, "base64")
					.toString("ascii")
					.split(":")
					.map((n) => parseInt(n))

				const fieldName = names[i]

				return delegateToSchema({
					schema: mainschema,
					fieldName,
					args: { id },
					info,
				})
			},
		},
	},
	typeDefs: `
		interface Node {
			id: ID!
			anilistId: Int
		}
		${names
			.map(
				(name) => `type ${name} implements Node {
			id: ID!
			anilistId: Int
		}`,
			)
			.join("\n")}
		type Query {
			node(id: ID!): Node
		}
	`,
})
