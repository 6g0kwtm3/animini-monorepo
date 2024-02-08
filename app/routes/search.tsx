import type { LoaderFunction } from "@remix-run/cloudflare"
import { json, type ClientLoaderFunctionArgs } from "@remix-run/react"
import { Effect, pipe } from "effect"
import { graphql } from "~/lib/graphql"
import { Remix } from "~/lib/Remix/index.server"
import {
    ClientArgs,
    EffectUrql,
    LoaderArgs,
    LoaderLive
} from "~/lib/urql.server"

export const loader = (async (args) => {
	return await pipe(
		Effect.gen(function* (_) {
			const client = yield* _(EffectUrql)
			const { searchParams } = yield* _(ClientArgs)

			const data = yield* _(
				client.query(
					graphql(`
						query SearchQuery(
							$q: String
							$sort: [MediaSort] = [POPULARITY_DESC, SCORE_DESC]
						) {
							page: Page(perPage: 10) {
								media(search: $q, sort: $sort) {
									id
									...SearchItem_media
								}
							}
						}
					`),
					{
						q: searchParams.get("q")
					}
				)
			)

			return json(data, {
				headers: {
					"Cache-Control": `max-age=${24 * 60 * 60}, s-maxage=${24 * 60 * 60}, stale-while-revalidate=${365 * 24 * 60 * 60}, public`
				}
			})
		}),

		Effect.provide(LoaderLive),
		Effect.provideService(LoaderArgs, args),

		Remix.runLoader
	)
}) satisfies LoaderFunction

let timeout: NodeJS.Timeout
export async function clientLoader(args: ClientLoaderFunctionArgs) {
	clearTimeout(timeout)

	return new Promise(
		(resolve, reject) =>
			(timeout = setTimeout(() => {
				args.serverLoader().then(resolve, reject)
			}, 300))
	)
}
