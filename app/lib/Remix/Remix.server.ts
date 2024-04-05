import { Cause, Data, Effect, Exit, Option, ReadonlyRecord, pipe } from "effect"
import { LoaderArgs, Timeout } from "~/lib/urql.server"
import { Token } from "../viewer"

import { Schema } from "@effect/schema"
import type { StructFields } from "@effect/schema/Schema"

import { NoSuchElementException } from "effect/Cause"

import type { LoaderFunctionArgs, TypedResponse } from "@remix-run/cloudflare"
import { json } from "@remix-run/cloudflare"
import type { ClientLoaderFunctionArgs } from "@remix-run/react"
import cookie from "cookie"
import { dev } from "../dev"

export const Cookie = <I, A>(
	name: string,
	schema: Schema.Schema<never, I, A>
): Effect.Effect<
	Option.Option<A>,
	never,
	LoaderFunctionArgs | ClientLoaderFunctionArgs
> =>
	Effect.gen(function* (_) {
		const { request } = yield* _(LoaderArgs)

		const cookies = cookie.parse(request.headers.get("Cookie") ?? "")

		return pipe(
			Option.fromNullable(cookies),
			Option.flatMap(ReadonlyRecord.get(name)),
			Option.flatMap(Schema.decodeOption(Schema.parseJson(schema)))
		) satisfies Option.Option<A>
	})

export const CloudflareKV = createCloudflareKV({
	"notifications-read": Schema.number
})

function createCloudflareKV<
	O extends Record<string, Schema.Schema<never, any, any>>
>(options: O) {
	return {
		store<K extends keyof O & string>(key: K) {
			const schema = options[key]!

			return {
				get(id: string | number) {
					return Effect.gen(function* (_) {
						const env = Option.getOrNull(yield* _(CloudflareEnv))

						const value = Option.fromNullable(
							yield* _(
								Effect.promise(async () => env?.MY_KV.get(`${key}-${id}`))
							)
						)

						return Option.flatMap(
							value,
							Schema.decodeOption(Schema.parseJson(schema))
						) satisfies Option.Option<Schema.Schema.To<O[K]>>
					})
				},
				put(id: string | number, value: Schema.Schema.From<O[K]>) {
					return Effect.gen(function* (_) {
						const env = Option.getOrNull(yield* _(CloudflareEnv))

						const encoded: string = yield* _(
							Schema.encode(Schema.parseJson(schema))(value)
						)

						yield* _(
							Effect.promise(async () =>
								env?.MY_KV.put(`${key}-${id}`, encoded)
							)
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

export function params<Fields extends StructFields>(fields: Fields) {
	return Effect.gen(function* (_) {
		const { params } = yield* _(LoaderArgs)
		return yield* _(Schema.decodeUnknown(Schema.struct(fields))(params))
	})
}

export const formData = Effect.gen(function* (_) {
	const { request } = yield* _(LoaderArgs)
	return yield* _(Effect.promise(async () => request.formData()))
})

export class ResponseError<T> extends Data.TaggedError("ResponseError")<{
	response: TypedResponse<T>
}> {}

export async function runLoader<E, A>(
	effect: Effect.Effect<A, E, never>
): Promise<A> {
	const exit = await pipe(effect, Effect.runPromiseExit)

	if (Exit.isSuccess(exit)) {
		return exit.value
	}
	const { cause } = exit

	if (dev) {
		throw json(Cause.pretty(cause), {
			status: 500
		})
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
		throw json(`Request timeout. Try again in ${error.reset - Date.now()}s`, {
			status: 504
		})
	}

	throw json(null, {
		status: 500
	})
}

export const Viewer = Effect.gen(function* (_) {
	const token = yield* _(Cookie("anilist-token", Token))

	return Option.map(token, (token) => token.viewer)
})
