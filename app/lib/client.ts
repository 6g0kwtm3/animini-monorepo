import { Effect, pipe } from "effect"


import type {
	GraphQLTaggedNode,
	MutationConfig,
	MutationParameters,
	OperationType
} from "relay-runtime"
import { Remix } from "./Remix"
import { EffectUrql } from "./urql"

class Client {
	async operation<T extends OperationType>(
		document: GraphQLTaggedNode,
		variables: T["variables"]
	): Promise<T["response"] | undefined> {
		return client_operation(document, variables)
	}

	async mutation<T extends MutationParameters>(
		config: MutationConfig<T>
	): Promise<T["response"]> {
		return pipe(
			Effect.gen(function* () {
				const client = yield* EffectUrql
				return yield* client.mutation<T>(config)
			}),
			Effect.provide(EffectUrql.Live),
			Remix.runLoader
		)
	}
}

export function client_get_client(): Client {
	return new Client()
}

export async function client_operation<T extends OperationType>(
	document: GraphQLTaggedNode,
	variables: T["variables"]
): Promise<T["response"] | undefined> {
	return pipe(
		Effect.gen(function* () {
			const client = yield* EffectUrql
			return yield* client.query<T>(document, variables)
		}),
		Effect.provide(EffectUrql.Live),
		Remix.runLoader
	)
}
