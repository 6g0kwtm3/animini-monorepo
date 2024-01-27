import crypto from "node:crypto"

import { Schema } from "@effect/schema"
import { json } from "@remix-run/node"
import { Effect, Option, Predicate } from "effect"
import { LoaderArgs } from "../urql"
import { JsonToToken } from "../viewer"

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

import cookie from "cookie"

