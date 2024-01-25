import crypto from "node:crypto"

import { json } from "@remix-run/node"
import { Effect } from "effect"
import { LoaderArgs } from "../urql"


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
