import { Schema } from "@effect/schema"
import { Option, pipe } from "effect"
import { JsonToToken } from "./viewer"

import type { ClientLoaderFunctionArgs } from "@remix-run/react"
import type { LoaderFunctionArgs } from "@vercel/remix"
import * as cookie from "cookie"
import { clientOnly$ } from "vite-env-only"
import type { TypedDocumentString } from "~/gql/graphql"

const API_URL = "https://graphql.anilist.co"
export function client_get_client(args: { request: Pick<Request, "headers" | "signal"> }): {
	operation: <T, V>(
		document: TypedDocumentString<T, V>,
		variables: V
	) => Promise<NonNullable<T> | null>
} {
	return {
		operation<T, V>(document: TypedDocumentString<T, V>, variables: V) {
			return client_operation(document, variables, args)
		}
	}
}

export type AnyLoaderFunctionArgs =
	| LoaderFunctionArgs
	| ClientLoaderFunctionArgs

export async function client_operation<T, V>(
	document: TypedDocumentString<T, V>,
	variables: V,
	args: { request: Pick<Request, "headers" | "signal"> }
): Promise<NonNullable<T> | null> {
	const body = Schema.encodeSync(Schema.parseJson(Schema.any))({
		query: document.toString(),
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
export function client_get_headers(
	request: Pick<Request, "headers">
): Headers | undefined {
	console.log(request.headers.get("cookie"))

	let cookies = cookie.parse(
		clientOnly$(globalThis.document.cookie) ??
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

export class Cookie {
	constructor(options: { key: string }) {}

	parse(request: Request) {}
}

export function decodeCookie(request: Request): Headers | undefined {
	let cookies = cookie.parse(
		clientOnly$(globalThis.document.cookie) ??
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
