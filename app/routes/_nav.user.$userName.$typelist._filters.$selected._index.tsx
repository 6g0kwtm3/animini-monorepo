import type { Params } from "@remix-run/react"
import {
    Await,
    defer,
    isRouteErrorResponse,
    useRouteError
} from "@remix-run/react"
import type { HeadersFunction, LoaderFunction } from "@vercel/remix"
// import type { FragmentType } from "~/lib/graphql"

import { MediaStatus, MediaType } from "~/gql/graphql"
import { graphql } from "~/lib/graphql"
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
    LoaderLive,
    type InferVariables
} from "~/lib/urql.server"

import {
    Effect,
    Option,
    Order,
    Predicate,
    ReadonlyArray,
    ReadonlyRecord,
    pipe
} from "effect"

// import {} from 'glob'

import { Suspense } from "react"
import { Card } from "~/components/Card"
import { List } from "~/components/List"
import { Loading, Skeleton } from "~/components/Skeleton"
import { Remix } from "~/lib/Remix/index.server"
import { useRawLoaderData } from "~/lib/data"
import { getLibrary } from "~/lib/electron/library.server"
import { MediaListItem } from "~/lib/entry/ListItem"
import { toWatch } from "~/lib/entry/toWatch"
import { m } from "~/lib/paraglide"

function TypelistQueryVariables(
	params: Readonly<Params<string>>
): Option.Option<InferVariables<ReturnType<typeof TypelistQuery>>> {
	const map = {
		animelist: MediaType.Anime,
		mangalist: MediaType.Manga
	}

	const type = pipe(
		Option.fromNullable(params["typelist"]),
		Option.flatMap((key) => ReadonlyRecord.get(map, key))
	)

	return Option.all({
		userName: Option.fromNullable(params["userName"]),
		type: type
	})
}

function TypelistQuery() {
	return graphql(`
		query UserListSelectedFiltersIndexQuery(
			$userName: String!
			$type: MediaType!
			$coverExtraLarge: Boolean = false
		) {
			MediaListCollection(userName: $userName, type: $type) {
				lists {
					name
					entries {
						...ListItem_entry
						...ToWatch_entry
						id
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
						({ title }) => title
					)
				),
				Effect.provide(LoaderLive),
				Effect.provideService(LoaderArgs, args),

				Remix.runLoader
			),
			SelectedList: pipe(
				Effect.Do,
				Effect.bind("args", () => ClientArgs),
				Effect.bind("client", () => EffectUrql),
				Effect.bind("variables", () => TypelistQueryVariables(args.params)),
				Effect.bind("selected", ({ args }) => {
					return Option.fromNullable(args.params["selected"])
				}),
				Effect.bind("data", ({ client, args, variables }) => {
					return client.query(TypelistQuery(), variables)
				}),
				Effect.bind("SelectedList", ({ data, selected }) => {
					return Option.fromNullable(
						data?.MediaListCollection?.lists?.find(
							(list) => list?.name === selected
						)
					)
				}),
				Effect.map(({ SelectedList: selectedList, args: { searchParams } }) => {
					const status = searchParams.getAll("status")

					const format = searchParams.getAll("format")

					let entries = pipe(
						selectedList.entries?.filter(Predicate.isNotNull) ?? [],
						ReadonlyArray.sortBy(
							// Order.mapInput(Order.number, (entry) => behind(entry)),
							Order.mapInput(
								Order.number,
								(entry) => toWatch(entry) || Number.POSITIVE_INFINITY
							),
							Order.mapInput(Order.number, (entry) => {
								return [
									MediaStatus.Releasing,
									MediaStatus.NotYetReleased
								].indexOf(entry.media?.status ?? MediaStatus.Cancelled)
							})
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

					return { ...selectedList, entries }
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
	return { "Cache-Control": loaderHeaders.get("Cache-Control") }
}) satisfies HeadersFunction

export default function Page() {
	const data = useRawLoaderData<typeof loader>()

	return (
		<>
			<MediaListHeader>
				<MediaListHeaderItem subtitle={m.to_watch()}>
					<Suspense fallback={<Skeleton>154h 43min</Skeleton>}>
						<Await resolve={data.SelectedList}>
							{(selectedList) => (
								<MediaListHeaderToWatch entries={selectedList.entries} />
							)}
						</Await>
					</Suspense>
				</MediaListHeaderItem>
				<MediaListHeaderItem subtitle={m.total_entries()}>
					<Suspense fallback={<Skeleton>80</Skeleton>}>
						<Await resolve={data.SelectedList}>
							{(selectedList) => selectedList.entries.length}
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
							<Await resolve={data.SelectedList}>
								{(selectedList) => {
									const mediaList = selectedList.entries
										.filter(Predicate.isNotNull)
										.map((entry) => (
											<MediaListItem key={entry.id} entry={entry} />
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
			className="m-4 bg-error-container text-on-error-container"
		>
			<h1 className="text-balance text-headline-md">Uh oh ...</h1>
			<p className="text-headline-sm">Something went wrong.</p>
			<pre className="overflow-auto text-body-md">{errorMessage}</pre>
		</Card>
	)
}
