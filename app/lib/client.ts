import { Schema } from "@effect/schema"
import type { TypedDocumentNode } from "@graphql-typed-document-node/core"
import { Option, Predicate, pipe } from "effect"
import { print } from "graphql"
import { JsonToToken } from "./viewer"

import type { LoaderFunctionArgs } from "@vercel/remix"
import * as cookie from "cookie"
import { IS_SERVER } from "./isClient"

const API_URL = "https://graphql.anilist.co"

export function client_get_client(args: LoaderFunctionArgs) {
	return {
		operation<T, V>(document: string | TypedDocumentNode<T, V>, variables: V) {
			return client_operation(document, variables, args)
		}
	}
}

export async function client_operation<T, V>(
	document: string | TypedDocumentNode<T, V>,
	variables: V,
	args: LoaderFunctionArgs
) {
	const body = Schema.encodeSync(Schema.parseJson(Schema.any))({
		query: Predicate.isString(document) ? document : print(document),
		variables: variables
	})

	const headers = new Headers()
	headers.append("Content-Type", "application/json")
	headers.append("Accept", "application/json")

	for (const [key, value] of client_get_headers(args.request)?.entries() ??
		[]) {
		headers.append(key, value)
	}

	const response = await fetch(API_URL, {
		body,
		headers,
		method: "post",
		signal: args.request.signal
	})

	if (!response.ok) {
		console.error({ response, body: await response.text() })
		throw new Response(null, {
			status: response.status,
			statusText: response.statusText
		})
	}

	const { data, errors } = Schema.decodeSync(
		Schema.struct({
			data: Schema.unknown,
			errors: Schema.optional(Schema.array(Schema.unknown))
		})
	)(await response.json())

	if (errors?.length) {
		console.error(errors)
	}

	return (data as T) ?? null
}

export function client_get_headers(request: Request) {
	let cookies = cookie.parse(
		(!IS_SERVER ? globalThis.document.cookie : null) ??
			request.headers.get("Cookie") ??
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
