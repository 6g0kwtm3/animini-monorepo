import type { ActionFunction } from "@remix-run/node"
import { Effect, pipe } from "effect"
import { graphql } from "~/gql"
import { Remix } from "~/lib/Remix/index.server"
import { EffectUrql, LoaderArgs, LoaderLive } from "~/lib/urql.server"

const ProgressIncrement = graphql(`
	mutation ProgressIncrement($mediaId: Int, $progress: Int) {
		SaveMediaListEntry(mediaId: $mediaId, progress: $progress) {
			id
		}
	}
`)

export const action = ((args) => {
	return pipe(
		Effect.gen(function* (_) {
			const client = yield* _(EffectUrql)
			return client.mutation(ProgressIncrement, {})
		}),
		Effect.provide(LoaderLive),
		Effect.provideService(LoaderArgs, args),
		Remix.runLoader
	)
}) satisfies ActionFunction

export default function Page() {
	return (
		<main>
			<h1>Progress incremented</h1>
		</main>
	)
}
