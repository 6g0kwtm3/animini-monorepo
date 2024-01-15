import type { LoaderFunction } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import type { ClientLoaderFunction, Params } from "@remix-run/react"
import {
    Form,
    Link,
    useLoaderData,
    useParams,
    useRouteLoaderData,
    useSearchParams,
} from "@remix-run/react"
// import type { FragmentType } from "~/gql"
// import { graphql, useFragment as readFragment } from "~/gql"
import { MediaFormat, MediaStatus, MediaType } from "~/gql/graphql"

import {
    ClientArgs,
    ClientLoaderLive,
    EffectUrql,
    LoaderArgs,
    LoaderLive,
    nonNull,
    type InferVariables,
} from "~/lib/urql"

import {
    Effect,
    Order,
    Predicate,
    ReadonlyArray,
    ReadonlyRecord,
    Sink,
    Stream,
    pipe,
} from "effect"

import { ButtonText, ButtonTonal } from "~/components/Button"
import {
    graphql,
    useFragment as readFragment,
    useFragment,
    type FragmentType,
} from "~/gql"

import { } from "~/components/Dialog"

import {
    TooltipRich,
    TooltipRichActions,
    TooltipRichContainer,
    TooltipRichSupportingText,
    TooltipRichTrigger
} from "~/components/Tooltip"
import { avalible as getAvalible } from "~/lib/avalible"
import { behind } from "~/lib/behind"
import type { loader as rootLoader } from "~/root"

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
		throw redirect(`/${params["userName"]}/animelist`)
	}

	return {
		userName: params["userName"]!,
		type,
	}
}

const _loader = pipe(
	Stream.Do,
	Stream.bind("args", () => ClientArgs),
	Stream.bind("client", () => EffectUrql),
	Stream.flatMap(({ client, args }) =>
		client.query(TypelistQuery, TypelistQueryVariables(args.params)),
	),
)

export const loader = (async (args) => {
	return pipe(
		_loader,
		Stream.run(Sink.head()),
		Effect.flatten,
		Effect.provide(LoaderLive),
		Effect.provideService(LoaderArgs, args),
		Effect.runPromise,
	)
}) satisfies LoaderFunction

export const clientLoader = (async (args) => {
	return pipe(
		_loader,
		Stream.run(Sink.head()),
		Effect.flatten,

		Effect.provide(ClientLoaderLive),
		Effect.provideService(LoaderArgs, args),
		Effect.runPromise,
	)
}) satisfies ClientLoaderFunction

const ToWatch_entry = graphql(`
	fragment ToWatch_entry on MediaList {
		...Behind_entry
		media {
			duration
			id
		}
		id
	}
`)

function toWatch(data: FragmentType<typeof ToWatch_entry>) {
	const entry = readFragment(ToWatch_entry, data)
	return (
		behind(entry) * ((entry.media?.duration ?? 25) - 3)
	)
}

function formatWatch(minutes: number) {
	if (!Number.isFinite(minutes)) {
		return ""
	}
	if (minutes > 60) {
		return Math.floor(minutes / 60) + "h " + (minutes % 60) + "min"
	}
	return minutes + "min"
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
		page?.entries?.filter(nonNull) ?? [],
		ReadonlyArray.sortBy(
			// Order.mapInput(Order.number, (entry) => behind(entry)),
			Order.mapInput(Order.number, (entry)=>toWatch(entry)||Number.POSITIVE_INFINITY),
			Order.mapInput(Order.number, (entry) => {
				return [MediaStatus.Releasing, MediaStatus.NotYetReleased].indexOf(
					entry?.media?.status,
				)
			}),
		),
	)

	if (status.length) {
		entries = entries.filter((entry) =>
			status.includes(entry?.media?.status ?? ""),
		)
	}

	if (format.length) {
		entries = entries.filter((entry) =>
			format.includes(entry?.media?.format ?? ""),
		)
	}

	return (
		<>
			<div className={""}>
				<h2 className="mx-4 flex flex-wrap justify-between text-display-md">
					<div>{searchParams.get("selected")}</div>
					<div className="">
						{formatWatch(
							entries
								?.map(toWatch)
								.filter(Number.isFinite)
								.reduce((a, b) => a + b, 0) ?? 0,
						)}
					</div>
				</h2>
				<div className="py-2">
					<ol>
						{entries?.map((entry) => {
							return (
								<li key={entry.id}>
									<ListItem entry={entry}></ListItem>
								</li>
							)
						})}
					</ol>
				</div>
				{/* <ol className="flex justify-center gap-2">
          <li>
            <Link
              to={
                pageNumber > 1
                  ? `?page=${pageNumber - 1}&${deleteSearchParam(
                      searchParams,
                      "page",
                    )}`
                  : `?${searchParams}`
              }
              className={btn()}
              aria-disabled={!(pageNumber > 1)}
            >
              <div>Prev</div>
            </Link>
          </li>
          <li>
            <Form action="get">
              <input
                type="hidden"
                name="selected"
                defaultValue={searchParams.get("selected") ?? undefined}
              />
              <label htmlFor="" className="p-1">
                <input
                  name="page"
                  type="text"
                  className="box-content h-[2ch] w-[2ch]"
                  defaultValue={pageNumber}
                />
              </label>
            </Form>
          </li>
          <li>
            <Link
              to={
                page?.pageInfo?.hasNextPage
                  ? `?page=${Number(pageNumber) + 1}&${deleteSearchParam(
                      searchParams,
                      "page",
                    )}`
                  : `?${searchParams}`
              }
              className={btn()}
              aria-disabled={!page?.pageInfo?.hasNextPage}
            >
              <div>Next</div>
            </Link>
          </li>
        </ol> */}
			</div>
		</>
	)
}

const ListItem_entry = graphql(`
	fragment ListItem_entry on MediaList {
		...ToWatch_entry
		...Progress_entry
		score
		media {
			id
			title {
				userPreferred
			}
			coverImage {
				extraLarge
				medium
			}
		}
	}
`)

function ListItem(props: { entry: FragmentType<typeof ListItem_entry> }) {
	const entry = readFragment(ListItem_entry, props.entry)

	return (
		<div className="group flex grid-flow-col items-start gap-4 px-4 py-3 text-on-surface state-on-surface hover:state-hover">
			<>
				<div className="h-14 w-14 shrink-0">
					<img
						src={entry.media?.coverImage?.extraLarge || ""}
						className="h-14 w-14 bg-[image:--bg] bg-cover object-cover group-hover:hidden"
						style={{
							"--bg": `url(${entry.media?.coverImage?.medium})`,
						}}
						loading="lazy"
						alt=""
					/>
					<div className="i hidden p-1 i-12 group-hover:block">more_horiz</div>
				</div>
				<Link to={`/${entry.media?.id}`}>
					<span className="line-clamp-1 text-balance text-body-lg">
						{entry.media?.title?.userPreferred}
					</span>
					<div className="flex flex-wrap gap-1 text-body-md text-on-surface-variant">
						<div>
							<span className="i i-inline">grade</span>
							{entry.score}
						</div>
						<>
							&middot;
							<div>
								<span className="i i-inline">timer</span>
								{formatWatch(toWatch(entry))} to watch
							</div>
						</>

						{/* &middot;
						<div>
							<span className="i i-inline">next_plan</span>
							{behind(entry)} behind
						</div> */}
					</div>
				</Link>
				{entry && (
					<div className="ms-auto shrink-0 text-label-sm text-on-surface-variant">
						<Progress entry={entry}></Progress>
					</div>
				)}
			</>
		</div>
	)
}

const Progress_entry = graphql(`
	fragment Progress_entry on MediaList {
		id
		progress
		media {
			...Avalible_media
			id
			episodes
		}
	}
`)

function Progress(props: { entry: FragmentType<typeof Progress_entry> }) {
	const entry = useFragment(Progress_entry, props.entry)
	const avalible = getAvalible(entry.media)
	const data = useRouteLoaderData<typeof rootLoader>("root")
	const params = useParams()

	return (
		<TooltipRich placement="top">
			<TooltipRichTrigger className="relative">
				{entry.progress}
				{Predicate.isNumber(avalible) ? (
					<>
						/
						<span
							className={
								avalible != entry.media?.episodes
									? "underline decoration-dotted"
									: ""
							}
						>
							{avalible}
						</span>
					</>
				) : (
					""
				)}
			</TooltipRichTrigger>
			<TooltipRichContainer>
				<TooltipRichSupportingText>
					{avalible !== entry.media?.episodes ? (
						<>
							Avalible episodes: {avalible ?? "unknown"}
							<br />
							Total episodes: {entry.media?.episodes ?? "unknown"}
						</>
					) : (
						<>All episodes are avalible</>
					)}
				</TooltipRichSupportingText>
				{Predicate.isString(data?.Viewer?.name) &&
					data.Viewer.name === params["userName"] && (
						<TooltipRichActions>
							<Form method="post">
								<input type="hidden" name="mediaId" value={entry.media?.id} />
								<input
									type="hidden"
									name="progress"
									value={(entry.progress ?? 0) + 1}
								/>
								<ButtonText type="submit" className="">
									<ButtonText.Icon>add</ButtonText.Icon>
									Increment progress
								</ButtonText>
							</Form>
						</TooltipRichActions>
					)}
			</TooltipRichContainer>
		</TooltipRich>
	)
}



export default function Page() {
	const [searchParams] = useSearchParams()

	const data = useLoaderData<typeof loader>()

	const selected = searchParams.get("selected")

	let allLists = data?.MediaListCollection?.lists
		?.filter(nonNull)
		.sort(
			Order.reverse(Order.mapInput(Order.string, (list) => list.name ?? "")),
		)

	let lists = allLists

	if (selected) {
		lists = lists?.filter((list) => list.name === selected)
	}

	const order = ReadonlyRecord.fromEntries(
		(data?.User?.mediaListOptions?.animeList?.sectionOrder ?? [])
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
									to={{
										search: `?selected=${list.name}`,
									}}
								>
									<ButtonTonal
										className={`${
											selected === list.name ? `!bg-tertiary-container ` : ``
										}!rounded capitalize`}
									>
										{list.name}
									</ButtonTonal>
								</Link>
							</li>
						)
					})}
				</ul>

				{lists?.map((list) => {
					return <MediaList key={list.name} item={list}></MediaList>
				})}
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
