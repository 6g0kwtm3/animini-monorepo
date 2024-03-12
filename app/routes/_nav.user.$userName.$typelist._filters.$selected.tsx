import {
	Await,
	Outlet,
	isRouteErrorResponse,
	useRouteError,
	useSearchParams,
	type ClientLoaderFunction,
	type ClientLoaderFunctionArgs,
	type ShouldRevalidateFunction
} from "@remix-run/react"

import type { HeadersFunction, LoaderFunction } from "@vercel/remix"
import { defer } from "@vercel/remix"

// import type { FragmentType } from "~/lib/graphql"

import { MediaSort, MediaStatus, MediaType } from "~/gql/graphql"
import {
	graphql,
	makeFragmentData,
	useFragment as readFragment,
	type FragmentType
} from "~/lib/graphql"
import {
	AwaitLibrary,
	MediaListHeader,
	MediaListHeaderItem,
	MediaListHeaderToWatch
} from "~/lib/list/MediaList"
import { LoaderArgs, LoaderLive } from "~/lib/urql.server"

import { Effect, Order, Predicate, ReadonlyArray, pipe } from "effect"

// import {} from 'glob'

import { Schema } from "@effect/schema"
import type { ReactNode } from "react"
import { Suspense } from "react"
import { clientOnly$, serverOnly$ } from "vite-env-only"
import { Card } from "~/components/Card"
import { List } from "~/components/List"
import { Loading, Skeleton } from "~/components/Skeleton"
import { Remix } from "~/lib/Remix/index.server"
import { Ariakit } from "~/lib/ariakit"
import { client, createGetInitialData } from "~/lib/cache.client"
import { client_get_client, type AnyLoaderFunctionArgs } from "~/lib/client"
import { useRawLoaderData } from "~/lib/data"
import { getLibrary } from "~/lib/electron/library.server"
import {
	MediaListItem,
	type ListItem_EntryFragment
} from "~/lib/entry/ListItem"
import { toWatch } from "~/lib/entry/toWatch"
import { getCacheControl } from "~/lib/getCacheControl"
import { m } from "~/lib/paraglide"
import { queryOptions } from "@tanstack/react-query"

function UserListSelectedFiltersIndexQuery() {
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
						...FilterEntries_entries
					}
				}
			}
		}
	`)
}

export const loader = ((args) => {
	const r = options(args)
	return r.queryFn(r)
}) satisfies LoaderFunction

const cacheControl = {
	maxAge: 15,
	staleWhileRevalidate: 45,
	private: true
}

export const headers = (({ loaderHeaders }) => {
	const cacheControl = loaderHeaders.get("Cache-Control")
	return Predicate.isString(cacheControl)
		? { "Cache-Control": cacheControl }
		: new Headers()
}) satisfies HeadersFunction

async function fetchSelectedList(args: {
	request: Pick<Request, "headers" | "signal">
	params: Schema.Schema.To<typeof Params>
}) {
	const client = await client_get_client(args)

	const data = await client.operation(UserListSelectedFiltersIndexQuery(), {
		userName: args.params.userName,
		type: {
			animelist: MediaType.Anime,
			mangalist: MediaType.Manga
		}[args.params.typelist]
	})

	const selectedList = data?.MediaListCollection?.lists?.find(
		(list) => list?.name === args.params.selected
	)

	if (!selectedList) {
		throw new Response("List not found", {
			status: 404
		})
	}

	return {
		...data,
		selectedList
	}
}

const SortEntries_entries = graphql(`
	fragment SortEntries_entries on MediaList {
		id
		...ListItem_entry
		progress
		score
		...ToWatch_entry
		media {
			id
			status(version: 2)
			title {
				userPreferred
			}
		}
		updatedAt
	}
`)

function sortEntries(
	data: readonly FragmentType<typeof SortEntries_entries>[],
	searchParams: URLSearchParams
) {
	let entries = readFragment<typeof SortEntries_entries>(data)
	const sorts = searchParams.getAll("sort")

	const order: Order.Order<(typeof entries)[number]>[] = []

	for (const sort of sorts) {
		if (sort === MediaSort.ScoreDesc) {
			order.push(
				Order.reverse(Order.mapInput(Order.number, (entry) => entry.score ?? 0))
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
			(entry) => toWatch(entry) || Number.POSITIVE_INFINITY
		),
		Order.mapInput(Order.number, (entry) => {
			return [MediaStatus.Releasing, MediaStatus.NotYetReleased].indexOf(
				entry.media?.status ?? MediaStatus.Cancelled
			)
		})
	)

	return ReadonlyArray.sortBy(...order)(entries)
}

const FilterEntries_entries = graphql(`
	fragment FilterEntries_entries on MediaList {
		id
		...SortEntries_entries
		...MediaListHeaderToWatch_entries
		...ToWatch_entry
		progress
		media {
			id
			status(version: 2)
			format
		}
	}
`)

function filterEntries(
	data: readonly FragmentType<typeof FilterEntries_entries>[],
	searchParams: URLSearchParams
) {
	let entries = readFragment<typeof FilterEntries_entries>(data)
	const status = searchParams.getAll("status")
	const format = searchParams.getAll("format")
	const progresses = searchParams.getAll("progress")

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

	return entries
}

export const shouldRevalidate: ShouldRevalidateFunction = ({
	currentParams,
	nextParams,
	formMethod,
	defaultShouldRevalidate
}) => {
	if (
		formMethod?.toUpperCase() === "GET" &&
		currentParams.userName === nextParams.userName &&
		currentParams.typelist === nextParams.typelist &&
		currentParams.selected === nextParams.selected
	) {
		return false
	}
	return defaultShouldRevalidate
}

const Params = Schema.struct({
	selected: Schema.string,
	userName: Schema.string,
	typelist: Schema.literal("animelist", "mangalist")
})

function queryFn(args: {
	request: Pick<Request, "headers" | "signal">
	params: Schema.Schema.To<typeof Params>
}) {
	return defer(
		{
			Library:
				serverOnly$(
					pipe(
						Effect.succeed(
							ReadonlyArray.groupBy(
								Object.values(getLibrary()),
								({ title }) => title ?? ""
							)
						),
						Effect.provide(LoaderLive),
						Effect.provideService(LoaderArgs, args),
						Remix.runLoader
					)
				) ?? Promise.resolve({}),
			query: fetchSelectedList(args)
		},
		{
			headers: {
				"Cache-Control": getCacheControl(cacheControl)
			}
		}
	)
}

function options(args: AnyLoaderFunctionArgs) {
	return queryOptions({
		staleTime: cacheControl.maxAge * 1000,
		queryKey: [
			"_nav.user.$userName.$typelist._filters.$selected",
			Schema.decodeUnknownSync(Params)(args.params)
		] as const,
		queryFn: ({ queryKey: [, params] }) => queryFn({ ...args, params })
	})
}

let getInitialData = clientOnly$(createGetInitialData())
export const clientLoader: ClientLoaderFunction = async (args) => {
	return await client.fetchQuery({
		...options(args),
		initialData: await getInitialData<any>?.(args)
	})
}
clientLoader.hydrate = true

export default function Page(): ReactNode {
	const data = useRawLoaderData<typeof loader>()
	const [search] = useSearchParams()

	return (
		<>
			<MediaListHeader>
				<MediaListHeaderItem subtitle={m.to_watch()}>
					<Suspense fallback={<Skeleton>154h 43min</Skeleton>}>
						<Await resolve={data.query}>
							{({ selectedList }) => (
								<MediaListHeaderToWatch
									entries={filterEntries(
										makeFragmentData<typeof FilterEntries_entries>(
											selectedList.entries?.filter(Predicate.isNotNull) ?? []
										),
										search
									)}
								/>
							)}
						</Await>
					</Suspense>
				</MediaListHeaderItem>
				<MediaListHeaderItem subtitle={m.total_entries()}>
					<Suspense fallback={<Skeleton>80</Skeleton>}>
						<Await resolve={data.query}>
							{({ selectedList }) =>
								filterEntries(
									makeFragmentData<typeof FilterEntries_entries>(
										selectedList.entries?.filter(Predicate.isNotNull) ?? []
									),
									search
								).length
							}
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
									const mediaList = sortEntries(
										filterEntries(
											makeFragmentData<typeof FilterEntries_entries>(
												selectedList.entries?.filter(Predicate.isNotNull) ?? []
											),
											search
										),
										search
									)
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
export function ErrorBoundary(): ReactNode {
	const error = useRouteError()

	// when true, this is what used to go to `CatchBoundary`
	if (isRouteErrorResponse(error)) {
		return (
			<div>
				<Ariakit.Heading>Oops</Ariakit.Heading>
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
			<Ariakit.Heading className="text-balance text-headline-md">
				Uh oh ...
			</Ariakit.Heading>
			<p className="text-headline-sm">Something went wrong.</p>
			<pre className="overflow-auto text-body-md">{errorMessage}</pre>
		</Card>
	)
}
