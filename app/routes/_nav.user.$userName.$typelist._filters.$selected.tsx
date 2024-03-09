import {
	Await,
	Outlet,
	isRouteErrorResponse,
	useRouteError
} from "@remix-run/react"

import type { HeadersFunction, LoaderFunction } from "@vercel/remix"
import { defer } from "@vercel/remix"

// import type { FragmentType } from "~/lib/graphql"

import { MediaSort, MediaStatus, MediaType } from "~/gql/graphql"
import { graphql, makeFragmentData } from "~/lib/graphql"
import type { MediaListHeaderToWatch_entries } from "~/lib/list/MediaList"
import {
	AwaitLibrary,
	MediaListHeader,
	MediaListHeaderItem,
	MediaListHeaderToWatch
} from "~/lib/list/MediaList"
import {
	ClientArgs,
	EffectUrql,
	LoaderArgs,
	LoaderLive
} from "~/lib/urql.server"

import { Effect, Option, Order, Predicate, ReadonlyArray, pipe } from "effect"

// import {} from 'glob'

import { Schema } from "@effect/schema"
import { Suspense } from "react"
import { Card } from "~/components/Card"
import { List } from "~/components/List"
import { Loading, Skeleton } from "~/components/Skeleton"
import { Remix } from "~/lib/Remix/index.server"
import { useRawLoaderData } from "~/lib/data"
import { getLibrary } from "~/lib/electron/library.server"
import {
	MediaListItem,
	type ListItem_EntryFragment
} from "~/lib/entry/ListItem"
import type { ToWatch_entry } from "~/lib/entry/toWatch"
import { toWatch } from "~/lib/entry/toWatch"
import { m } from "~/lib/paraglide"

function TypelistQuery() {
	return graphql(`
		query UserListSelectedFiltersIndexQuery(
			$userName: String!
			$type: MediaType!
			$coverExtraLarge: Boolean = false
			$isEntryId: Boolean!
			$entryId: Int
		) {
			...Entry_query
			MediaListCollection(userName: $userName, type: $type) {
				lists {
					name
					entries {
						...MediaListHeaderToWatch_entries
						...ListItem_entry
						...ToWatch_entry
						id
						updatedAt
						score
						media {
							id
							status(version: 2)
							format
						}
					}
				}
			}
		}
	`)
}

export const loader = (async (args) => {
	// make()

	return defer(
		{
			Library: pipe(
				Effect.succeed(
					ReadonlyArray.groupBy(
						Object.values(getLibrary()),
						({ title }) => title ?? ""
					)
				),
				Effect.provide(LoaderLive),
				Effect.provideService(LoaderArgs, args),
				Remix.runLoader
			),
			query: pipe(
				Effect.gen(function* (_) {
					const client = yield* _(EffectUrql)
					const { searchParams } = yield* _(ClientArgs)

					const params = yield* _(
						Remix.params({
							selected: Schema.string,
							userName: Schema.string,
							typelist: Schema.literal("animelist", "mangalist"),
							entryId: Schema.optional(Schema.NumberFromString)
						})
					)

					const { MediaListCollection, ...data } =
						(yield* _(
							client.query(TypelistQuery(), {
								userName: params.userName,
								entryId: params.entryId,
								isEntryId: Predicate.isNumber(params.entryId),
								type: {
									animelist: MediaType.Anime,
									mangalist: MediaType.Manga
								}[params.typelist]
							})
						)) ?? {}

					const selectedList = yield* _(
						Option.fromNullable(
							MediaListCollection?.lists?.find(
								(list) => list?.name === params.selected
							)
						)
					)

					const status = searchParams.getAll("status")
					const format = searchParams.getAll("format")
					const progresses = searchParams.getAll("progress")
					const sorts = searchParams.getAll("sort")

					let entries = selectedList.entries?.filter(Predicate.isNotNull) ?? []

					const order: Order.Order<(typeof entries)[number]>[] = []

					for (const sort of sorts) {
						if (sort === MediaSort.ScoreDesc) {
							order.push(
								Order.reverse(
									Order.mapInput(Order.number, (entry) => entry.score ?? 0)
								)
							)
						}
						if (sort === MediaSort.TitleEnglish) {
							order.push(
								Order.mapInput(
									Order.string,
									(entry) => entry.media?.title?.userPreferred ?? ""
								)
							)
						}
						if (sort === MediaSort.UpdatedAtDesc) {
							order.push(
								Order.reverse(
									Order.mapInput(Order.number, (entry) => entry.updatedAt ?? 0)
								)
							)
						}
					}

					order.push(
						Order.mapInput(
							Order.number,
							(entry) =>
								toWatch(makeFragmentData<ToWatch_entry>(entry)) ||
								Number.POSITIVE_INFINITY
						),
						Order.mapInput(Order.number, (entry) => {
							return [
								MediaStatus.Releasing,
								MediaStatus.NotYetReleased
							].indexOf(entry.media?.status ?? MediaStatus.Cancelled)
						})
					)

					entries = pipe(
						entries,
						ReadonlyArray.sortBy(
							// Order.mapInput(Order.number, (entry) => behind(entry)),
							...order
						)
					)

					if (status.length) {
						entries = entries.filter((entry) =>
							status.includes(entry.media?.status ?? "")
						)
					}

					if (format.length) {
						entries = entries.filter((entry) =>
							format.includes(entry.media?.format ?? "")
						)
					}

					for (const progress of progresses) {
						if (progress === "UNSEEN") {
							entries = entries.filter((entry) => toWatch(entry) > 0)
						}
						if (progress === "STARTED") {
							entries = entries.filter((entry) => (entry.progress ?? 0) > 0)
						}
					}

					return {
						...data,
						selectedList: {
							...selectedList,
							entries
						}
					}
				}),

				// Effect.catchTag("NoSuchElementException", () =>
				// 	Effect.succeed(new Response('"List not Found"', { status: 404 })),
				// ),
				Effect.provide(LoaderLive),
				Effect.provideService(LoaderArgs, args),
				Remix.runLoader
			)
		},
		{
			headers: {
				"Cache-Control": "max-age=15, stale-while-revalidate=45, private"
			}
		}
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
		<>
			<MediaListHeader>
				<MediaListHeaderItem subtitle={m.to_watch()}>
					<Suspense fallback={<Skeleton>154h 43min</Skeleton>}>
						<Await resolve={data.query}>
							{({ selectedList }) => (
								<MediaListHeaderToWatch
									entries={makeFragmentData<MediaListHeaderToWatch_entries>(
										selectedList.entries
									)}
								/>
							)}
						</Await>
					</Suspense>
				</MediaListHeaderItem>
				<MediaListHeaderItem subtitle={m.total_entries()}>
					<Suspense fallback={<Skeleton>80</Skeleton>}>
						<Await resolve={data.query}>
							{({ selectedList }) => selectedList.entries.length}
						</Await>
					</Suspense>
				</MediaListHeaderItem>
			</MediaListHeader>

			<div className="-mx-4 sm:-my-4">
				<div className={``}>
					<List>
						<Suspense
							fallback={
								<Loading>
									{ReadonlyArray.range(1, 7).map((i) => (
										<MediaListItem key={i} entry={null} />
									))}
								</Loading>
							}
						>
							<Await resolve={data.query}>
								{({ selectedList }) => {
									const mediaList = selectedList.entries
										.filter(Predicate.isNotNull)
										.map((entry) => (
											<MediaListItem
												key={entry.id}
												entry={makeFragmentData<ListItem_EntryFragment>(entry)}
											/>
										))

									return (
										<Suspense fallback={mediaList}>
											<AwaitLibrary resolve={data.Library}>
												{mediaList}
											</AwaitLibrary>
										</Suspense>
									)
								}}
							</Await>
						</Suspense>
					</List>
				</div>
			</div>
			<Outlet />
		</>
	)
}
export function ErrorBoundary() {
	const error = useRouteError()

	// when true, this is what used to go to `CatchBoundary`
	if (isRouteErrorResponse(error)) {
		return (
			<div>
				<h1>Oops</h1>
				<p>Status: {error.status}</p>
				<p>{error.data}</p>
			</div>
		)
	}

	// Don't forget to typecheck with your own logic.
	// Any value can be thrown, not just errors!
	let errorMessage = "Unknown error"
	if (error instanceof Error) {
		errorMessage = error.message || errorMessage
	}

	return (
		<Card
			variant="elevated"
			className="m-4"
		>
			<h1 className="text-balance text-headline-md">Uh oh ...</h1>
			<p className="text-headline-sm">Something went wrong.</p>
			<pre className="overflow-auto text-body-md">{errorMessage}</pre>
		</Card>
	)
}
