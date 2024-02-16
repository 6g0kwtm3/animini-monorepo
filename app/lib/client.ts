import { Schema } from "@effect/schema"
import { TypedDocumentNode } from "@graphql-typed-document-node/core"
import { Option, Predicate, pipe } from "effect"
import { print } from "graphql"
import { JsonToToken } from "./viewer"

const API_URL = "https://graphql.anilist.co"
export async function client_operation<T, V>(
	document: string | TypedDocumentNode<T, V>,
	variables: V,
	options?: {
		headers?: Headers
		signal?: AbortSignal
	}
) {
	const body = await Schema.encodePromise(Schema.parseJson(Schema.any))({
		query: Predicate.isString(document) ? document : print(document),
		variables: variables
	})

	const headers = new Headers()
	headers.append("Content-Type", "application/json")
	headers.append("Accept", "application/json")

	for (const [key, value] of options?.headers?.entries() ?? []) {
		headers.append(key, value)
	}

	const response = await fetch(API_URL, {
		body,
		headers,
		method: "post",
		signal: options?.signal
	})

	if (!response.ok) {
		throw response
	}

	const { data, errors } = await Schema.decodePromise(
		Schema.struct({
			data: Schema.unknown,
			errors: Schema.optional(Schema.array(Schema.unknown))
		})
	)(await response.json())

	if (errors?.length) {
		console.log(errors)
	}

	return (data as T) ?? null
}

import * as cookie from "cookie"
import { IS_SERVER } from "./isClient"

export function client_get_headers(request: Request) {
	let cookies = cookie.parse(
		(!IS_SERVER ? globalThis.document.cookie : null) ??
			request?.headers.get("Cookie") ??
			""
	)

	let headers = pipe(
		cookies["anilist-token"] ?? "",
		Schema.decodeOption(JsonToToken),
		Option.map(
			({ token }) =>
				new Headers({
					Authorization: `Bearer ${token.trim()}`
				})
		),

		Option.getOrUndefined
	)

	return headers
}
