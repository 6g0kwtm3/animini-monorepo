import type { LoaderFunction, SerializeFrom } from "@vercel/remix"

import { json, type ClientLoaderFunctionArgs } from "@remix-run/react"
import { Effect, Predicate, pipe } from "effect"
import type { ReactNode } from "react"
import { Layout, LayoutBody, LayoutPane } from "~/components/Layout"
import { List } from "~/components/List"
import { Remix } from "~/lib/Remix/index.server"
import { useRawLoaderData } from "~/lib/data"
import { graphql, makeFragmentData } from "~/lib/graphql"
import { SearchItem, type SearchItem_media } from "~/lib/search/SearchItem"
import {
	ClientArgs,
	EffectUrql,
	LoaderArgs,
	LoaderLive
} from "~/lib/urql.server"
import { Card } from "~/components/Card"

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
							$coverExtraLarge: Boolean = false
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

export async function clientLoader(
	args: ClientLoaderFunctionArgs
): Promise<SerializeFrom<typeof loader>> {
	clearTimeout(timeout)

	return new Promise<SerializeFrom<typeof loader>>(
		(resolve, reject) =>
			(timeout = setTimeout(() => {
				args.serverLoader<typeof loader>().then(resolve, reject)
			}, 300))
	)
}

export default function Page(): ReactNode {
	const data = useRawLoaderData<typeof loader>()

	return (
		<LayoutBody>
			<LayoutPane>
				<Card variant="elevated" className="max-sm:contents">
					<div className="-mx-4">
						<List>
							{data?.page?.media
								?.filter(Predicate.isNotNull)
								.map((media) => (
									<SearchItem
										media={makeFragmentData<SearchItem_media>(media)}
										key={media.id}
									/>
								))}
						</List>
					</div>
				</Card>
			</LayoutPane>
		</LayoutBody>
	)
}
