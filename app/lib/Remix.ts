import {
	Cause,
	Data,
	Effect,
	Exit,
	Option,
	Record as ReadonlyRecord,
	pipe,
} from "effect"
import { Timeout } from "~/lib/urql"

import { NoSuchElementException } from "effect/Cause"

import type { TypedResponse } from "@remix-run/node"
import { json } from "@remix-run/node"
import { ArkErrors } from "arktype"
import cookie from "cookie"
import { dev } from "./dev"
import { JsonToToken } from "./viewer"

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
			status: 500,
		})
	}

	const { error } = cause

	if (error instanceof NoSuchElementException) {
		throw json("Not found", {
			status: 404,
		})
	}

	if (error instanceof ResponseError) {
		throw error.response
	}

	if (error instanceof Timeout) {
		throw json(`Request timeout. Try again in ${error.reset}s`, {
			status: 504,
		})
	}

	throw json(null, {
		status: 500,
	})
}

export function Viewer(): Option.Option<{
	readonly name: string
	readonly id: number
}> {
	const cookies = cookie.parse(document.cookie)

	return pipe(
		Option.fromNullable(cookies),
		Option.flatMap(ReadonlyRecord.get("anilist-token")),
		Option.flatMap((value) => {
			const result = JsonToToken(value)
			return result instanceof ArkErrors
				? Option.none()
				: Option.some(result.viewer)
		})
	)
}

export * as Remix from "./Remix"
