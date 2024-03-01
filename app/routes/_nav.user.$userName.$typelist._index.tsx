import { Link, json } from "@remix-run/react"
import type { HeadersFunction, LoaderFunction } from "@vercel/remix"
import {
	Effect,
	Order,
	Predicate,
	ReadonlyArray,
	ReadonlyRecord,
	pipe
} from "effect"

import { Card } from "~/components/Card"
import { MediaType } from "~/gql/graphql"
import { Remix } from "~/lib/Remix/index.server"
import { useRawLoaderData } from "~/lib/data"
import { MediaListItem } from "~/lib/entry/ListItem"
import { graphql } from "~/lib/graphql"
import {
	EffectUrql,
	LoaderArgs,
	LoaderLive
} from "~/lib/urql.server"

import { Schema } from "@effect/schema"
import { LayoutBody } from "~/components/Layout"
import { List } from "~/components/List"
import { button } from "~/lib/button"

export const loader = (async (args) => {
	return pipe(
		Effect.gen(function* (_) {
			const client = yield* _(EffectUrql)
			const params = yield* _(
				Remix.params({
					userName: Schema.string,
					typelist: Schema.literal("animelist", "mangalist")
				})
			)

			const mediaType = {
				animelist: MediaType.Anime,
				mangalist: MediaType.Manga
			}[params.typelist]

			const MediaListCollection = yield* _(
				client.query(
					graphql(`
						query UserListQuery(
							$userName: String!
							$type: MediaType!
							$coverExtraLarge: Boolean = false
						) {
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
					{
						userName: params.userName,
						type: mediaType
					}
				),
				Effect.flatMap((data) => Effect.fromNullable(data?.MediaListCollection))
			)

			const listOptions =
				mediaType === MediaType.Anime
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
						"Cache-Control": "max-age=15, stale-while-revalidate=45, private"
					}
				}
			)
		}),

		Effect.provide(LoaderLive),
		Effect.provideService(LoaderArgs, args),
		Remix.runLoader
	)
}) satisfies LoaderFunction

export const headers = (({ loaderHeaders }) => {
	const cacheControl = loaderHeaders.get("Cache-Control")
	return Predicate.isString(cacheControl)
		? { "Cache-Control": cacheControl }
		: new Headers()
}) satisfies HeadersFunction

export default function Page() {
	const data = useRawLoaderData<typeof loader>()

	return (
		<LayoutBody>
			<div className="flex flex-col gap-4">
				<h1 className="text-balance text-headline-lg">
					{data.MediaListCollection.user?.name}
				</h1>

				<ul className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
					{data.MediaListCollection.lists.map((list) => {
						return (
							list.name && (
								<li key={list.name}>
									<Card variant="outlined" render={<article />}>
										<h2 className="text-balance">{list.name}</h2>
										<List className="-mx-4">
											{list.entries?.map((entry) => {
												return <MediaListItem entry={entry} key={entry.id} />
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
						)
					})}
				</ul>
			</div>
		</LayoutBody>
	)
}
