import type { HeadersFunction, LoaderFunction } from "@remix-run/cloudflare"
import type { Params } from "@remix-run/react"
import {
	Await,
	defer,
	isRouteErrorResponse,
	useRouteError
} from "@remix-run/react"
// import type { FragmentType } from "~/lib/graphql"

import { MediaFormat, MediaStatus, MediaType } from "~/gql/graphql"
import { graphql } from "~/lib/graphql"
import {
	AwaitLibrary,
	MediaList,
	MediaListHeader,
	MediaListHeaderToWatch,
	MediaListRoot
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

import { layer } from "@effect/platform-node/FileSystem"
import { Suspense } from "react"
import { serverOnly$ } from "vite-env-only"
import { CardElevated } from "~/components/Card"
import List from "~/components/List"
import { Skeleton } from "~/components/Skeleton"
import { Remix } from "~/lib/Remix/index.server"
import { useRawLoaderData } from "~/lib/data"
import { getLibrary } from "~/lib/electron/library.server"
import { ListItemLoader } from "~/lib/entry/ListItem"
import { toWatch } from "~/lib/entry/toWatch"
import { m } from "~/lib/paraglide"

function TypelistQueryVariables(
	params: Readonly<Params<string>>
): Option.Option<InferVariables<typeof TypelistQuery>> {
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
		query TypelistQuery($userName: String!, $type: MediaType!) {
			MediaListCollection(userName: $userName, type: $type) {
				lists {
					name
					...MediaList_group
					entries {
						...ToWatch_entry
						id
						media {
							id
							status
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

	return defer({
		Library: pipe(
			Effect.succeed(
				ReadonlyArray.groupBy(Object.values(getLibrary()), ({ title }) => title)
			),
			Effect.provide(LoaderLive),
			Effect.provideService(LoaderArgs, args),
			Effect.provide(layer),
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
			Effect.map(({ SelectedList, args: { searchParams } }) => {
				const status = searchParams
					.getAll("status")
					.flatMap((status) => (status in STATUS_OPTIONS ? [status] : []))

				const format = searchParams
					.getAll("format")
					.flatMap((format) => (format in FORMAT_OPTIONS ? [format] : []))

				let entries = pipe(
					SelectedList.entries?.filter(Predicate.isNotNull) ?? [],
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

				return { ...SelectedList, entries }
			}),

			// Effect.catchTag("NoSuchElementException", () =>
			// 	Effect.succeed(new Response('"List not Found"', { status: 404 })),
			// ),
			Effect.provide(LoaderLive),
			Effect.provideService(LoaderArgs, args),
			Effect.provide(layer),
			Remix.runLoader
		)
	})
}) satisfies LoaderFunction

const STATUS_OPTIONS = {
	[MediaStatus.Finished]: m.media_status_finished(),
	[MediaStatus.Releasing]: m.media_status_releasing(),
	[MediaStatus.NotYetReleased]: m.media_status_not_yet_released(),
	[MediaStatus.Cancelled]: m.media_status_cancelled()
}

const FORMAT_OPTIONS = {
	[MediaFormat.Tv]: m.media_format_tv(),
	[MediaFormat.TvShort]: m.media_format_tv_short(),
	[MediaFormat.Movie]: m.media_format_movie(),
	[MediaFormat.Special]: m.media_format_special(),
	[MediaFormat.Ova]: m.media_format_ova(),
	[MediaFormat.Ona]: m.media_format_ona(),
	[MediaFormat.Music]: m.media_format_music()
}

export const headers: HeadersFunction = () => {
	return { "Cache-Control": "max-age=60, private" }
}

export default function Page() {
	const data = useRawLoaderData<typeof loader>()

	return (
		<div className=" ">
			<div className={`pt-4`}>
				<MediaListRoot>
					<MediaListHeader>
						<Suspense fallback={<Skeleton>154h 43min</Skeleton>}>
							<Await resolve={data.SelectedList}>
								{(selectedList) => (
									<MediaListHeaderToWatch
										entries={selectedList.entries}
									></MediaListHeaderToWatch>
								)}
							</Await>
						</Suspense>
					</MediaListHeader>
					<List>
						<Suspense
							fallback={ReadonlyArray.range(1, 7).map((i) => (
								<ListItemLoader key={i} />
							))}
						>
							<Await resolve={data.SelectedList}>
								{(selectedList) => (
									<Suspense
										fallback={<MediaList entries={selectedList.entries} />}
									>
										<AwaitLibrary resolve={data.Library}>
											<MediaList entries={selectedList.entries} />
										</AwaitLibrary>
									</Suspense>
								)}
							</Await>
						</Suspense>
					</List>
				</MediaListRoot>
			</div>
		</div>
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
		<CardElevated className="m-4 bg-error-container text-on-error-container">
			<h1 className="text-balance text-headline-md">Uh oh ...</h1>
			<p className="text-headline-sm">Something went wrong.</p>
			<pre className="overflow-auto text-body-md">{errorMessage}</pre>
		</CardElevated>
	)
}
