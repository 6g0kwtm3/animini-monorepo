import type {
	HeadersFunction,
	LoaderFunction,
	MetaFunction,
	SerializeFrom
} from "@remix-run/cloudflare"
import { json } from "@remix-run/cloudflare"
import { Link, type ClientLoaderFunctionArgs } from "@remix-run/react"
import { useRawLoaderData } from "~/lib/data"

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
import {
	MediaListItem,
	type ListItem_EntryFragment
} from "~/lib/entry/ListItem"
import { graphql, makeFragmentData } from "~/lib/graphql"
import { EffectUrql, LoaderArgs, LoaderLive } from "~/lib/urql.server"

import { Schema } from "@effect/schema"
import type { ReactNode } from "react"
import { LayoutBody } from "~/components/Layout"
import { List } from "~/components/List"
import { Ariakit } from "~/lib/ariakit"
import { button } from "~/lib/button"
import { getCacheControl } from "~/lib/getCacheControl"

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
					.filter((el) => el != null)
					.map((key, index) => [key, index])
			)

			return json(
				{
					MediaListCollection: {
						...MediaListCollection,
						lists: pipe(
							MediaListCollection.lists
								?.filter((el) => el != null)
								.map((list) => ({
									...list,
									entries: list.entries?.slice(0, 4).filter((el) => el != null)
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
						"Cache-Control": getCacheControl(cacheControl)
					}
				}
			)
		}),

		Effect.provide(LoaderLive),
		Effect.provideService(LoaderArgs, args),
		Remix.runLoader
	)
}) satisfies LoaderFunction
const cacheControl = {
	maxAge: 15,
	staleWhileRevalidate: 45,
	private: true
}

export async function clientLoader(
	args: ClientLoaderFunctionArgs
): Promise<SerializeFrom<typeof loader>> {
	return args.serverLoader<typeof loader>()
}
clientLoader.hydrate = true

export const headers = (({ loaderHeaders }) => {
	const cacheControl = loaderHeaders.get("Cache-Control")
	return Predicate.isString(cacheControl)
		? { "Cache-Control": cacheControl }
		: new Headers()
}) satisfies HeadersFunction

export const meta = (({ params }) => {
	return [
		{
			title:
				params.typelist === "animelist"
					? `${params.userName}'s anime list`
					: `${params.userName}'s manga list`
		}
	]
}) satisfies MetaFunction<typeof loader>
export default function Page(): ReactNode {
	const data = useRawLoaderData<typeof clientLoader>()

	return (
		<LayoutBody>
			<div className="flex flex-col gap-4">
				<Ariakit.Heading className="text-balance text-headline-lg">
					{data.MediaListCollection.user?.name}
				</Ariakit.Heading>

				<Ariakit.HeadingLevel>
					<ul className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
						{data.MediaListCollection.lists.map((list) => {
							return (
								list.name && (
									<li key={list.name}>
										<Card variant="outlined" render={<article />}>
											<Ariakit.Heading className="text-balance">
												{list.name}
											</Ariakit.Heading>
											<List className="-mx-4 @container">
												{list.entries?.map((entry) => {
													return (
														<MediaListItem
															entry={makeFragmentData<ListItem_EntryFragment>(
																entry
															)}
															key={entry.id}
														/>
													)
												})}
											</List>
											<Link
												prefetch="intent"
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
				</Ariakit.HeadingLevel>
			</div>
		</LayoutBody>
	)
}
