import {
	Cause,
	Data,
	Effect,
	Exit,
	Option,
	ReadonlyRecord,
	pipe
} from "effect"
import { LoaderArgs, Timeout } from "~/lib/urql.server"
import { Token } from "../viewer"

import { Schema } from "@effect/schema"
import type { StructFields } from "@effect/schema/Schema"

import { NoSuchElementException } from "effect/Cause"

import cookie from "cookie"
import { dev } from "../dev"

export const Cookie = <I, A>(
	name: string,
	schema: Schema.Schema<never, I, A>
) =>
	Effect.gen(function* (_) {
		const { request } = yield* _(LoaderArgs)

		const cookies = cookie.parse(request.headers.get("Cookie") ?? "")

		return pipe(
			Option.fromNullable(cookies),
			Option.flatMap(ReadonlyRecord.get(name)),
			Option.flatMap(Schema.decodeOption(Schema.parseJson(schema)))
		) satisfies Option.Option<A>
	})

export function params<Fields extends StructFields>(fields: Fields) {
	return Effect.gen(function* (_) {
		const { params } = yield* _(LoaderArgs)
		return yield* _(Schema.decodeUnknownEither(Schema.struct(fields))(params))
	})
}

export const formData = Effect.gen(function* (_) {
	const { request } = yield* _(LoaderArgs)
	return yield* _(Effect.promise(() => request.formData()))
})

export class ResponseError extends Data.TaggedError("ResponseError")<{
	response: Response
}> {}

export async function runLoader<E, A>(effect: Effect.Effect<never, E, A>) {
	const exit = await pipe(effect, Effect.runPromiseExit)

	if (Exit.isSuccess(exit)) {
		return exit.value
	}
	const { cause } = exit

	if (dev) {
		// throw new Error(Cause.pretty(cause))
	}

	if (!Cause.isFailType(cause)) {
		throw new Response(null, {
			status: 500
		})
	}

	const { error } = cause

	if (error instanceof NoSuchElementException) {
		throw new Response("Not found", {
			status: 404
		})
	}

	if (error instanceof ResponseError) {
		throw error.response
	}

	if (error instanceof Timeout) {
		throw new Response(
			`Request timeout. Try again in ${error.reset - Date.now()}s`,
			{
				status: 504
			}
		)
	}

	throw new Response(null, {
		status: 500
	})
}

export const Viewer = Effect.gen(function* (_) {
	const token = yield* _(Cookie("anilist-token", Token))

	return Option.map(token, (token) => token.viewer)
})
