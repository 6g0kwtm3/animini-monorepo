import type { HeadersFunction, LoaderFunction } from "@remix-run/node"
import type { Params } from "@remix-run/react"
import {
    isRouteErrorResponse,
    json,
    useParams,
    useRouteError,
    useSearchParams
} from "@remix-run/react"
// import type { FragmentType } from "~/gql"
// import { graphql, useFragment as readFragment } from "~/gql"
import { MediaFormat, MediaStatus, MediaType } from "~/gql/graphql"

import {
    ClientArgs,
    EffectUrql,
    LoaderArgs,
    LoaderLive,
    nonNull,
    useRawLoaderData,
    type InferVariables
} from "~/lib/urql"

import {
    Effect,
    Option,
    Order,
    ReadonlyArray,
    ReadonlyRecord,
    pipe
} from "effect"

import { graphql, useFragment as readFragment, type FragmentType } from "~/gql"

import { } from "~/components/Dialog"

// import {} from 'glob'

import { layer } from "@effect/platform-node/FileSystem"
import { FileSystem } from "@effect/platform/FileSystem"
import { CardElevated } from "~/components/Card"
import List from "~/components/List"
import { Remix } from "~/lib/Remix"
import { getLibrary } from "~/lib/electron/library.server"
import { Library, ListItem } from "~/lib/entry/ListItem"
import { formatWatch, toWatch } from "~/lib/entry/toWatch"

const TypelistQuery = graphql(`
	query TypelistQuery($userName: String!, $type: MediaType!) {
		MediaListCollection(userName: $userName, type: $type) {
			lists {
				name
				...MediaList_group
				entries {
					id
					media {
						id
						status
					}
				}
			}
		}
	}
`)

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

export const loader = (async (args) => {
	// make()

	return pipe(
		Effect.Do,
		Effect.bind("args", () => ClientArgs),
		Effect.bind("client", () => EffectUrql),
		Effect.bind("variables", () => TypelistQueryVariables(args.params)),
		Effect.bind("selected", ({ args }) =>
			Option.fromNullable(args.params["selected"])
		),
		Effect.bind("FileSystem", () => FileSystem),
		Effect.bind("MediaListCollection", ({ client, args, variables }) =>
			pipe(
				client.query(TypelistQuery, variables),
				Effect.flatMap((data) => Effect.fromNullable(data?.MediaListCollection))
			)
		),
		Effect.bind("Library", () =>
			Effect.succeed(
				ReadonlyArray.groupBy(Object.values(getLibrary()), ({ title }) => title)
			)
		),
		Effect.flatMap(({ MediaListCollection, Library, selected }) => {
			const SelectedList = MediaListCollection.lists?.find(
				(list) => list?.name === selected
			)

			return Effect.all({
				SelectedList: Option.fromNullable(SelectedList),
				Library: Option.some(Library)
			})
		}),

		
		// Effect.catchTag("NoSuchElementException", () =>
		// 	Effect.succeed(new Response('"List not Found"', { status: 404 })),
		// ),
		Effect.provide(LoaderLive),
		Effect.provideService(LoaderArgs, args),
		Effect.provide(layer),

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

export const headers: HeadersFunction = () => {
	return {	"Cache-Control": "max-age=60, private"}
}

declare global {
	interface Array<T> {
		indexOf(searchElement: unknown, fromIndex?: number): number
	}
}

const MediaList_group = graphql(`
	fragment MediaList_group on MediaListGroup {
		name
		entries {
			id
			...ToWatch_entry
			...ListItem_entry
			media {
				id
				status
				format
			}
		}
	}
`)

function MediaList(props: { item: FragmentType<typeof MediaList_group> }) {
	const page = readFragment(MediaList_group, props.item)

	const [searchParams] = useSearchParams()

	const status = searchParams
		.getAll("status")
		.flatMap((status) => (status in STATUS_OPTIONS ? [status] : []))

	const format = searchParams
		.getAll("format")
		.flatMap((format) => (format in FORMAT_OPTIONS ? [format] : []))

	let entries = pipe(
		page.entries?.filter(nonNull) ?? [],
		ReadonlyArray.sortBy(
			// Order.mapInput(Order.number, (entry) => behind(entry)),
			Order.mapInput(
				Order.number,
				(entry) => toWatch(entry) || Number.POSITIVE_INFINITY
			),
			Order.mapInput(Order.number, (entry) => {
				return [MediaStatus.Releasing, MediaStatus.NotYetReleased].indexOf(
					entry.media?.status
				)
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

	return (
		<>
			<div className={""}>
				<h2 className="mx-4 flex flex-wrap justify-between text-balance text-display-md">
					<div>{page.name}</div>
					<div className="">
						{formatWatch(
							entries
								.map(toWatch)
								.filter(Number.isFinite)
								.reduce((a, b) => a + b, 0)
						)}
					</div>
				</h2>
				<List className="py-2">
					{entries.map((entry) => {
						return <ListItem key={entry.id} entry={entry}></ListItem>
					})}
				</List> 
				{/* <ol className="flex justify-center gap-2"> <li> <Link   to={     pageNumber > 1       ? `?page=${pageNumber - 1}&${deleteSearchParam( searchParams, "page",         )}`       : `?${searchParams}`   }   className={btn()}   aria-disabled={!(pageNumber > 1)} >   <div>Prev</div> </Link> </li> <li> <Form action="get">   <input     type="hidden"     name="selected"     defaultValue={searchParams.get("selected") ?? undefined}   />   <label htmlFor="" className="p-1">     <input       name="page"       type="text"       className="box-content h-[2ch] w-[2ch]"       defaultValue={pageNumber}     />   </label> </Form> </li> <li> <Link   to={     page?.pageInfo?.hasNextPage       ? `?page=${Number(pageNumber) + 1}&${deleteSearchParam( searchParams, "page",         )}`       : `?${searchParams}`   }   className={btn()}   aria-disabled={!page?.pageInfo?.hasNextPage} >   <div>Next</div> </Link> </li>         </ol> */}
			</div>
		</>
	)
}

export default function Page() {
	const [searchParams] = useSearchParams()
	const params = useParams()

	const data = useRawLoaderData<typeof loader>()

	const selected = params["selected"]

	return (
		<main className=" ">
			<div className={` `}>
				<Library.Provider value={data.Library}>
					<MediaList item={data.SelectedList}></MediaList>
				</Library.Provider>
			</div>
		</main>
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

const STATUS_OPTIONS = {
	[MediaStatus.Finished]: "Finished",
	[MediaStatus.Releasing]: "Releasing",
	[MediaStatus.NotYetReleased]: "Not Yet Released",
	[MediaStatus.Cancelled]: "Cancelled"
}

const FORMAT_OPTIONS = {
	[MediaFormat.Tv]: "TV",
	[MediaFormat.TvShort]: "TV Short",
	[MediaFormat.Movie]: "Movie",
	[MediaFormat.Special]: "Special",
	[MediaFormat.Ova]: "OVA",
	[MediaFormat.Ona]: "ONA",
	[MediaFormat.Music]: "Music"
}
