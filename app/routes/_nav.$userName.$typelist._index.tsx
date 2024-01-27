import type { HeadersFunction, LoaderFunction } from "@remix-run/node"
import type { Params } from "@remix-run/react"
import { Link, json, useParams } from "@remix-run/react"
import { Effect, Order, ReadonlyArray, ReadonlyRecord, pipe } from "effect"

import { CardOutlined } from "~/components/Card"
import List from "~/components/List"
import { graphql } from "~/gql"
import { MediaType } from "~/gql/graphql"
import { Remix } from "~/lib/Remix"
import { button } from "~/lib/button"
import { ListItem } from "~/lib/entry/ListItem"
import type { InferVariables } from "~/lib/urql"
import {
    ClientArgs,
    EffectUrql,
    LoaderArgs,
    LoaderLive,
    nonNull,
    useRawLoaderData
} from "~/lib/urql"

const ListsQuery = graphql(`
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
`)

function isTypelist(value: unknown): value is "animelist" | "mangalist" {
	return value === "animelist" || value === "mangalist"
}

function typelistToMediaType(typelist: "animelist" | "mangalist") {
	return {
		animelist: MediaType.Anime,
		mangalist: MediaType.Manga
	}[typelist]
}

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

const _loader = pipe(
	Effect.Do,
	Effect.bind("args", () => ClientArgs),
	Effect.bind("client", () => EffectUrql),
	Effect.bind("variables", ({ args }) =>
		Effect.succeed(FiltersQueryVariables(args.params))
	),
	Effect.bind("MediaListCollection", ({ client, variables }) =>
		pipe(
			client.query(ListsQuery, variables),
			Effect.flatMap((data) => Effect.fromNullable(data?.MediaListCollection))
		)
	),
	Effect.map(({ MediaListCollection, variables }) => ({
		MediaListCollection,
		mediaType: variables.type
	}))
)

export const loader = (async (args) => {
	return pipe(
		_loader,

		Effect.provide(LoaderLive),
		Effect.provideService(LoaderArgs, args),

		Effect.map((data) =>
			json(data, {
				headers: {
					"Cache-Control": "max-age=60, s-maxage=60"
				}
			})
		),
		Remix.runLoader
	)
}) satisfies LoaderFunction

// export const clientLoader = (async (args) => {
// 	return pipe(
// 		_loader,
//

// 		Effect.provide(ClientLoaderLive),
// 		Effect.provideService(LoaderArgs, args),

// 		Effect.map((data) =>
// 			json(data, {
// 				headers: {
// 					"Cache-Control": "max-age=60, s-maxage=60"
// 				}
// 			})
// 		),
// 		Remix.runLoader
// 	)
// }) satisfies ClientLoaderFunction

export const headers: HeadersFunction = () => {
	return { "Cache-Control": "max-age=60, private" }
}

export default function Page() {
	const data = useRawLoaderData<typeof loader>()
	const params = useParams()

	const listOptions =
		data.mediaType === MediaType.Anime
			? data.MediaListCollection.user?.mediaListOptions?.animeList
			: data.MediaListCollection.user?.mediaListOptions?.mangaList

	const order = ReadonlyRecord.fromEntries(
		(listOptions?.sectionOrder ?? [])
			.filter(nonNull)
			.map((key, index) => [key, index])
	)

	let lists = pipe(
		data.MediaListCollection.lists?.filter(nonNull) ?? [],
		ReadonlyArray.sortBy(
			Order.mapInput(
				Order.number,
				(list) => order[list.name ?? ""] ?? Number.POSITIVE_INFINITY
			),
			Order.reverse(Order.mapInput(Order.string, (list) => list.name ?? ""))
		)
	)

	return (
		<div className="flex flex-col gap-4 p-2">
			<h1 className="text-balance text-headline-lg">
				{data.MediaListCollection.user?.name}
			</h1>

			<ul className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
				{lists.map((list) => {
					return (
						<li key={list.name} className="">
							<CardOutlined asChild>
								<article>
									<h2 className="text-balance">{list.name}</h2>
									<List className="-mx-4">
										{list.entries
											?.filter(nonNull)
											.slice(0, 4)
											.map((entry) => {
												return (
													<ListItem entry={entry} key={entry.id}></ListItem>
												)
											})}
									</List>
									<Link
										to={list.name}
										className={button({ className: "w-full" })}
									>
										more
									</Link>
								</article>
							</CardOutlined>
						</li>
					)
				})}
			</ul>
		</div>
	)
}
