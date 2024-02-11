import crypto from "node:crypto"

import { json } from "@remix-run/cloudflare"
import { Option, Predicate, Cause, Data, Effect, Exit, pipe } from "effect"
import { LoaderArgs, Timeout } from "~/lib/urql.server"
import { JsonToToken } from "../viewer"

import { Schema } from "@effect/schema"
import type { StructFields } from "@effect/schema/Schema"

import { NoSuchElementException } from "effect/Cause"

import cookie from "cookie"

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

 

	if (process.env.NODE_ENV === "development" || import.meta.env.DEV) {
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

export function eTag() {
	return Effect.flatMap((data) =>
		Effect.gen(function* (_) {
			const { request } = yield* _(LoaderArgs)
			const IfNoneMatch = request.headers.get("If-None-Match")
			const ETag = crypto
				.createHmac("sha256", "secret")
				.update(JSON.stringify(data))
				.digest("hex")

			if (!IfNoneMatch || ETag != IfNoneMatch) {
				return json(data, {
					headers: {
						ETag,
						"Cache-Control": ""
					}
				})
			}

			return json(null, {
				status: 304,
				statusText: "Not Modified",
				headers: { ETag }
			})
		})
	)
}

export const Viewer = Effect.gen(function* (_) {
	const { request } = yield* _(LoaderArgs)

	const { "anilist-token": token } = cookie.parse(
		request.headers.get("Cookie") ?? ""
	)

	if (!Predicate.isString(token)) {
		return Option.none()
	}

	return Option.map(
		Schema.decodeOption(JsonToToken)(token),
		(token) => token.viewer
	)
})
