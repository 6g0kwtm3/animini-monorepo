import { Effect, pipe } from "effect"

import type {
	ActionFunctionArgs,
	LoaderFunctionArgs
} from "@remix-run/cloudflare"
import type {
	unstable_ClientAction,
	unstable_ClientLoader
} from "@remix-run/react"
import { clientOnly$ } from "vite-env-only"
import type { TypedDocumentString } from "~/gql/graphql"
import { client, persister } from "./cache.client"
import { Remix } from "./Remix"
import { EffectUrql, LoaderArgs, } from "./urql"

export function client_get_client(args: { request: Request }): {
	operation: <T, V>(
		document: TypedDocumentString<T, V>,
		variables: V
	) => Promise<NonNullable<T> | null>
} {
	return {
		async operation<T, V>(document: TypedDocumentString<T, V>, variables: V) {
			return client_operation(document, variables, args)
		}
	}
}

export type AnyLoaderFunctionArgs =
	| LoaderFunctionArgs
	| Parameters<unstable_ClientLoader>[0]

export type AnyActionFunctionArgs =
	| ActionFunctionArgs
	| Parameters<unstable_ClientAction>[0]

export async function client_operation<T, V>(
	document: TypedDocumentString<T, V>,
	variables: V,
	args: { request: Request }
): Promise<NonNullable<T> | null> {
	return (
		clientOnly$(
			client.ensureQueryData({
				revalidateIfStale: true,
				queryKey: [document.toString(), variables],
				persister,
				queryFn: async () => server_operation(document, variables, args)
			})
		) ?? server_operation(document, variables, args)
	)
}

export async function server_operation<T, V>(
	document: TypedDocumentString<T, V>,
	variables: V,
	args: { request: Request }
): Promise<NonNullable<T> | null> {
	return pipe(
		Effect.gen(function* () {
			const client = yield* EffectUrql
			return yield* client.query(document, variables)
		}),
		Effect.provide(EffectUrql.Live),
		Effect.provideService(LoaderArgs, args),
		Remix.runLoader
	)
}
