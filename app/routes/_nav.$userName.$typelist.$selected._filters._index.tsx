import type { LoaderFunction } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import type { Params } from "@remix-run/react"
import {
	Link,
	useLoaderData,
	useParams,
	useSearchParams,
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
	type InferVariables,
} from "~/lib/urql"

import { Effect, Order, ReadonlyArray, ReadonlyRecord, pipe } from "effect"

import { graphql, useFragment as readFragment, type FragmentType } from "~/gql"

import {} from "~/components/Dialog"

// import {} from 'glob'

import { layer } from "@effect/platform-node/FileSystem"
import { FileSystem } from "@effect/platform/FileSystem"
import { Library, ListItem } from "~/lib/entry/ListItem"
import { button } from "~/lib/button"
import { getLibrary } from "~/lib/electron/library.server"
import { formatWatch, toWatch } from "~/lib/entry/toWatch"

const TypelistQuery = graphql(`
	query TypelistQuery($userName: String!, $type: MediaType!) {
		User(name: $userName) {
			id
			mediaListOptions {
				animeList {
					sectionOrder
				}
			}
		}
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
	params: Readonly<Params<string>>,
): InferVariables<typeof TypelistQuery> {
	const type = {
		animelist: MediaType.Anime,
		mangalist: MediaType.Manga,
	}[String(params["typelist"])]

	if (!type) {
		throw redirect(`/${params["userName"]}/animelist/${params.selected}`)
	}

	return {
		userName: params["userName"]!,
		type,
	}
}

const _loader = pipe(
	Effect.Do,
	Effect.bind("args", () => ClientArgs),
	Effect.bind("client", () => EffectUrql),
	Effect.flatMap(({ client, args }) =>
		client.query(TypelistQuery, TypelistQueryVariables(args.params)),
	),
)

export const loader = (async (args) => {
	// make()

	return pipe(
		Effect.Do,
		Effect.bind("FileSystem", () => FileSystem),
		Effect.bind("TypelistQuery", () => _loader),
		Effect.bind("Library", () =>
			Effect.succeed(
				ReadonlyArray.groupBy(
					Object.values(getLibrary()),
					({ title }) => title,
				),
			),
		),
		Effect.map(({ TypelistQuery, Library }) => ({
			...TypelistQuery,
			Library,
		})),

		Effect.provide(LoaderLive),
		Effect.provideService(LoaderArgs, args),
		Effect.provide(layer),
		Effect.runPromise,
	)
}) satisfies LoaderFunction

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
				(entry) => toWatch(entry) || Number.POSITIVE_INFINITY,
			),
			Order.mapInput(Order.number, (entry) => {
				return [MediaStatus.Releasing, MediaStatus.NotYetReleased].indexOf(
					entry.media?.status,
				)
			}),
		),
	)

	if (status.length) {
		entries = entries.filter((entry) =>
			status.includes(entry.media?.status ?? ""),
		)
	}

	if (format.length) {
		entries = entries.filter((entry) =>
			format.includes(entry.media?.format ?? ""),
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
								.reduce((a, b) => a + b, 0),
						)}
					</div>
				</h2>
				<div className="py-2">
					<ol>
						{entries.map((entry) => {
							return (
								<li key={entry.id}>
									<ListItem entry={entry}></ListItem>
								</li>
							)
						})}
					</ol>
				</div>
				{/* <ol className="flex justify-center gap-2"> <li> <Link   to={     pageNumber > 1       ? `?page=${pageNumber - 1}&${deleteSearchParam( searchParams, "page",         )}`       : `?${searchParams}`   }   className={btn()}   aria-disabled={!(pageNumber > 1)} >   <div>Prev</div> </Link> </li> <li> <Form action="get">   <input     type="hidden"     name="selected"     defaultValue={searchParams.get("selected") ?? undefined}   />   <label htmlFor="" className="p-1">     <input       name="page"       type="text"       className="box-content h-[2ch] w-[2ch]"       defaultValue={pageNumber}     />   </label> </Form> </li> <li> <Link   to={     page?.pageInfo?.hasNextPage       ? `?page=${Number(pageNumber) + 1}&${deleteSearchParam( searchParams, "page",         )}`       : `?${searchParams}`   }   className={btn()}   aria-disabled={!page?.pageInfo?.hasNextPage} >   <div>Next</div> </Link> </li>         </ol> */}
			</div>
		</>
	)
}

export default function Page() {
	const [searchParams] = useSearchParams()
	const params = useParams()

	const data = useLoaderData<typeof loader>()

	const selected = params.selected

	let allLists = data.MediaListCollection?.lists
		?.filter(nonNull)
		.sort(
			Order.reverse(Order.mapInput(Order.string, (list) => list.name ?? "")),
		)

	let lists = allLists

	if (selected) {
		lists = lists?.filter((list) => list.name === selected)
	}

	const order = ReadonlyRecord.fromEntries(
		(data.User?.mediaListOptions?.animeList?.sectionOrder ?? [])
			.filter(nonNull)
			.map((key, index) => [key, index]),
	)

	lists?.sort(
		Order.mapInput(
			Order.number,
			(list) => order[list.name ?? ""] ?? Number.POSITIVE_INFINITY,
		),
	)

	return (
		<main className=" ">
			<div className={` `}>
				<ul className="flex gap-2 overflow-x-auto overscroll-contain [@media(pointer:fine)]:flex-wrap [@media(pointer:fine)]:justify-center">
					{allLists?.map((list) => {
						return (
							<li className="min-w-max" key={list.name}>
								<Link
									to={`/${params.userName}/${params.typelist}/${list.name}/`}
									className={button({
										variant: "tonal",
										className: `${
											selected === list.name
												? `force:bg-tertiary-container `
												: ``
										}force:rounded capitalize`,
									})}
								>
									{list.name}
								</Link>
							</li>
						)
					})}
				</ul>

				<Library.Provider value={data.Library}>
					{lists?.map((list) => {
						return <MediaList key={list.name} item={list}></MediaList>
					})}
				</Library.Provider>
			</div>
		</main>
	)
}

const STATUS_OPTIONS = {
	[MediaStatus.Finished]: "Finished",
	[MediaStatus.Releasing]: "Releasing",
	[MediaStatus.NotYetReleased]: "Not Yet Released",
	[MediaStatus.Cancelled]: "Cancelled",
}

const FORMAT_OPTIONS = {
	[MediaFormat.Tv]: "TV",
	[MediaFormat.TvShort]: "TV Short",
	[MediaFormat.Movie]: "Movie",
	[MediaFormat.Special]: "Special",
	[MediaFormat.Ova]: "OVA",
	[MediaFormat.Ona]: "ONA",
	[MediaFormat.Music]: "Music",
}
