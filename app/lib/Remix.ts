import {
    Cause,
    Data,
    Effect,
    Exit,
    Option,
    Record as ReadonlyRecord,
    pipe
} from "effect"
import { LoaderArgs, Timeout } from "~/lib/urql"
import { Token } from "./viewer"

import { Schema } from "@effect/schema"

import { NoSuchElementException } from "effect/Cause"

import type { TypedResponse } from "@remix-run/node"
import { json } from "@remix-run/node"
import cookie from "cookie"
import { dev } from "./dev"

export function Cookie<I, A>(
	name: string,
	schema: Schema.Schema<A, I>
): Option.Option<A> {
	const cookies = cookie.parse(document.cookie)

	return pipe(
		Option.fromNullable(cookies),
		Option.flatMap(ReadonlyRecord.get(name)),
		Option.flatMap(Schema.decodeOption(Schema.parseJson(schema)))
	) satisfies Option.Option<A>
}

export const CloudflareKV = createCloudflareKV({})

function createCloudflareKV<
	O extends Record<string, Schema.Schema<any, any, never>>
>(options: O) {
	return {
		store<K extends keyof O & string>(key: K) {
			const schema = options[key]!

			return {
				get(id: string | number) {
					return Effect.gen(function* () {
						const env = Option.getOrNull(yield* CloudflareEnv)

						const value = Option.fromNullable(
							yield* Effect.promise(async () => env?.MY_KV.get(`${key}-${id}`))
						)

						return Option.flatMap(
							value,
							Schema.decodeOption(Schema.parseJson(schema))
						) satisfies Option.Option<Schema.Schema.Type<O[K]>>
					})
				},
				put(id: string | number, value: Schema.Schema.Encoded<O[K]>) {
					return Effect.gen(function* () {
						const env = Option.getOrNull(yield* CloudflareEnv)

						const encoded: string = yield* Schema.encode(
							Schema.parseJson(schema)
						)(value)

						yield* Effect.promise(async () =>
							env?.MY_KV.put(`${key}-${id}`, encoded)
						)
					})
				}
			}
		}
	}
}

const CloudflareEnv = Effect.succeed(
	Option.fromNullable<null | {
		MY_KV: {
			put: (key: string, value: string) => Promise<void>
			get: (key: string) => Promise<string>
		}
	}>(null)
)

export function params<Fields extends Schema.Struct.Fields>(fields: Fields) {
	return Effect.gen(function* () {
		const { params } = yield* LoaderArgs
		return yield* Schema.decodeUnknown(Schema.Struct(fields))(params)
	})
}

export const formData = Effect.gen(function* () {
	const { request } = yield* LoaderArgs
	return yield* Effect.promise(async () => request.formData())
})

export class ResponseError<T> extends Data.TaggedError("ResponseError")<{
	response: TypedResponse<T>
}> {}

export async function runLoader<E, A>(effect: Effect.Effect<A, E>): Promise<A> {
	const exit = await pipe(effect, Effect.runPromiseExit)

	if (Exit.isSuccess(exit)) {
		return exit.value
	}
	const { cause } = exit

	if (dev) {
		throw new Error(Cause.pretty(cause))
	}

	if (!Cause.isFailType(cause)) {
		throw json(null, {
			status: 500
		})
	}

	const { error } = cause

	if (error instanceof NoSuchElementException) {
		throw json("Not found", {
			status: 404
		})
	}

	if (error instanceof ResponseError) {
		throw error.response
	}

	if (error instanceof Timeout) {
		throw json(`Request timeout. Try again in ${error.reset}s`, {
			status: 504
		})
	}

	throw json(null, {
		status: 500
	})
}

export function Viewer(): Option.Option<{
	readonly name: string
	readonly id: number
}> {
	const token = Cookie("anilist-token", Token)

	return Option.map(token, (token) => token.viewer)
}

export * as Remix from "./Remix"
