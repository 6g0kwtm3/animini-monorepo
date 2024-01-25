import { Schema } from "@effect/schema"
import type { StructFields } from "@effect/schema/Schema"
import { json, redirect } from "@remix-run/node"
import { Cause, Data, Effect, Exit, pipe } from "effect"
import { NoSuchElementException } from "effect/Cause"
import { LoaderArgs, Timeout } from "../urql"

import crypto from "node:crypto"

export function params<Fields extends StructFields>(fields: Fields) {
	return Effect.gen(function* (_) {
		const { params } = yield* _(LoaderArgs)
		return yield* _(Schema.decodeUnknownEither(Schema.struct(fields))(params))
	})
}

class RedirectError extends Data.TaggedError("Redirect")<{
	url: string
	statusText?: ResponseInit["statusText"]
	headers?: ResponseInit["headers"]
	status?: ResponseInit["status"]
}> {}

class ResponseError extends Data.TaggedError("Response")<{
	data: BodyInit | null | undefined
	statusText?: ResponseInit["statusText"]
	headers?: ResponseInit["headers"]
	status: ResponseInit["status"]
}> {}

export async function runLoader<E, A>(effect: Effect.Effect<never, E, A>) {
	const exit = await pipe(effect, Effect.runPromiseExit)

	if (Exit.isSuccess(exit)) {
		return exit.value
	}
	const { cause } = exit

	if (import.meta.env.DEV) {
		throw new Error(Cause.pretty(cause))
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
		throw new Response(error.data, {
			status: error.status,
			statusText: error.statusText,
			headers: error.headers
		})
	}

	if (error instanceof RedirectError) {
		throw redirect(error.url, {
			status: error.status,
			statusText: error.statusText,
			headers: error.headers
		})
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
