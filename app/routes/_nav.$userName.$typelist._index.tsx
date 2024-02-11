import type { HeadersFunction, LoaderFunction } from "@remix-run/cloudflare"
import type { Params } from "@remix-run/react"
import { Link, json } from "@remix-run/react"
import {
	Effect,
	Order,
	Predicate,
	ReadonlyArray,
	ReadonlyRecord,
	pipe
} from "effect"

import { Card } from "~/components/Card"
import List from "~/components/List"
import { MediaType } from "~/gql/graphql"
import { Remix } from "~/lib/Remix/index.server"
import { button } from "~/lib/button"
import { useRawLoaderData } from "~/lib/data"
import { MediaListItem } from "~/lib/entry/ListItem"
import { graphql } from "~/lib/graphql"
import type { InferVariables } from "~/lib/urql.server"
import {
	ClientArgs,
	EffectUrql,
	LoaderArgs,
	LoaderLive
} from "~/lib/urql.server"

function FiltersQueryVariables(
	params: Readonly<Params<string>>
): InferVariables<typeof ListsQuery> {
	const type = {
		animelist: MediaType.Anime,
		mangalist: MediaType.Manga
	}[String(params["typelist"])]

	if (!type) {
		throw new Error(`Invalid list type`)
	}

	return {
		userName: params["userName"]!,
		type
	}
}

export const loader = (async (args) => {
	return pipe(
		Effect.gen(function* (_) {
			const args = yield* _(ClientArgs)
			const client = yield* _(EffectUrql)
			const variables = FiltersQueryVariables(args.params)

			const MediaListCollection = yield* _(
				client.query(
					graphql(`
						query ListsQuery($userName: String!, $type: MediaType!) {
							MediaListCollection(
								userName: $userName
								type: $type
								sort: [FINISHED_ON_DESC, UPDATED_TIME_DESC]
							) {
								user {
									id
									name
									mediaListOptions {
										animeList {
											sectionOrder
										}
										mangaList {
											sectionOrder
										}
									}
								}
								lists {
									name
									entries {
										id
										...ListItem_entry
									}
								}
							}
						}
					`),
					variables
				),
				Effect.flatMap((data) => Effect.fromNullable(data?.MediaListCollection))
			)

			const listOptions =
				variables.type === MediaType.Anime
					? MediaListCollection.user?.mediaListOptions?.animeList
					: MediaListCollection.user?.mediaListOptions?.mangaList

			const order = ReadonlyRecord.fromEntries(
				(listOptions?.sectionOrder ?? [])
					.filter(Predicate.isNotNull)
					.map((key, index) => [key, index])
			)

			return json(
				{
					MediaListCollection: {
						...MediaListCollection,
						lists: pipe(
							MediaListCollection.lists
								?.filter(Predicate.isNotNull)
								.map((list) => ({
									...list,
									entries: list.entries?.slice(0, 4).filter(Predicate.isNotNull)
								})) ?? [],
							ReadonlyArray.sortBy(
								Order.mapInput(
									Order.number,
									(list) => order[list.name ?? ""] ?? Number.POSITIVE_INFINITY
								),
								Order.reverse(
									Order.mapInput(Order.string, (list) => list.name ?? "")
								)
							)
						)
					}
				},
				{
					headers: {
						"Cache-Control": "max-age=60, s-maxage=60"
					}
				}
			)
		}),

		Effect.provide(LoaderLive),
		Effect.provideService(LoaderArgs, args),
		Remix.runLoader
	)
}) satisfies LoaderFunction

export const headers: HeadersFunction = () => {
	return { "Cache-Control": "max-age=60, private" }
}
export default function Page() {
	const data = useRawLoaderData<typeof loader>()

	return (
		<div className="flex flex-col gap-4 p-2">
			<h1 className="text-balance text-headline-lg">
				{data.MediaListCollection.user?.name}
			</h1>

			<ul className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
				{data.MediaListCollection.lists.map((list) => {
					return (
						<li key={list.name}>
							<Card variant="outlined" render={<article />}>
								<h2 className="text-balance">{list.name}</h2>
								<List className="-mx-4">
									{list.entries?.map((entry) => {
										return (
											<MediaListItem
												entry={entry}
												key={entry.id}
											></MediaListItem>
										)
									})}
								</List>
								<Link
									to={list.name}
									className={button({ className: "w-full" })}
								>
									more
								</Link>
							</Card>
						</li>
					)
				})}
			</ul>
		</div>
	)
}
