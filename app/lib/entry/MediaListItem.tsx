import { Link, useParams, useRouteLoaderData } from "@remix-run/react"

import { Skeleton } from "~/components/Skeleton"
import { m } from "~/lib/paraglide"

import ReactRelay from "react-relay"

import type { ComponentProps, ReactNode } from "react"
import { use } from "react"
import {
	ListItem,
	ListItemContent,
	ListItemContentSubtitle,
	ListItemContentTitle,
	ListItemImg,
} from "~/components/List"
import MaterialSymbolsPriorityHigh from "~icons/material-symbols/priority-high"

import { route_media } from "../route"
import { MediaCover } from "./MediaCover"
import { formatWatch } from "./ToWatch"

import MaterialSymbolsStarOutline from "~icons/material-symbols/star-outline"
import MaterialSymbolsTimerOutline from "~icons/material-symbols/timer-outline"
import { Progress, ProgressIncrement } from "./Progress"

import { Predicate } from "effect"
import type { MediaListItem_entry$key } from "~/gql/MediaListItem_entry.graphql"
import type {
	MediaListItemSubtitle_entry$key,
	MediaType,
} from "~/gql/MediaListItemSubtitle_entry.graphql"
import type { MediaListItemTitle_entry$key } from "~/gql/MediaListItemTitle_entry.graphql"
import MaterialSymbolsPlayArrow from "~icons/material-symbols/play-arrow"
import { M3 } from "../components"
import { ListContext } from "../list"
import { MediaTitle } from "../MediaTitle"
import { useFragment, usePreloadedQuery } from "../Network"

import { RootQuery, type clientLoader as rootLoader } from "~/root"

import type { MediaListItemSort_entry$key } from "~/gql/MediaListItemSort_entry.graphql"

import { TouchTarget } from "~/components"
import type { MediaListItemInfo_entry$key } from "~/gql/MediaListItemInfo_entry.graphql"
import type { MediaListItemSort_user$key } from "~/gql/MediaListItemSort_user.graphql"
import { sourceLanguageTag } from "~/paraglide/runtime"
import type { clientLoader } from "~/routes/_nav.user.$userName.$typelist/route"
import MaterialSymbolsArrowDownward from "~icons/material-symbols/arrow-downward"
import MaterialSymbolsInfoOutline from "~icons/material-symbols/info-outline"
import { btnIcon, button } from "../button"
import { MediaListSort } from "../MediaListSort"
import { useOptimisticSearchParams } from "../search/useOptimisticSearchParams"

const { graphql } = ReactRelay

export type ListItem_EntryFragment = typeof MediaListItem_entry

const MediaListItem_entry = graphql`
	fragment MediaListItem_entry on MediaList {
		media @required(action: LOG) {
			id
			...MediaCover_media
		}
		...ProgressIncrement_entry
		...MediaListItemTitle_entry
		...MediaListItemSubtitle_entry
		...ProgressMoreMenu_entry
		...MediaListItemInfo_entry
	}
`

export function MediaListItem({
	entry,
	...props
}: ComponentProps<"li"> & {
	entry: MediaListItem_entry$key
}): ReactNode {
	const data = useFragment(MediaListItem_entry, entry)

	const list = use(ListContext)

	return (
		data && (
			<ListItem {...props}>
				<ListItemImg>
					<MediaCover media={data.media} />
				</ListItemImg>

				<Link
					to={route_media({ id: data.media.id })}
					className={list.itemContent()}
				>
					<ListItemContentTitle>
						<MediaListItemTitle entry={data} />
					</ListItemContentTitle>
					<MediaListItemSubtitle entry={data} />
				</Link>
				<div className="flex">
					<ProgressIncrement entry={data} />
					<Info entry={data} />
				</div>
				{/* <MoreMenu entry={data} /> */}
			</ListItem>
		)
	)
}

const MediaListItemInfo_entry = graphql`
	fragment MediaListItemInfo_entry on MediaList {
		id
	}
`

function Info(props: { entry: MediaListItemInfo_entry$key }): ReactNode {
	const entry = useFragment(MediaListItemInfo_entry, props.entry)
	const data = usePreloadedQuery(
		RootQuery,
		useRouteLoaderData<typeof rootLoader>("root")!.query
	)
	const params = useParams()

	const viewerIsUser =
		Predicate.isString(data.Viewer?.name) &&
		data.Viewer.name === params.userName
	const label = viewerIsUser ? "Edit" : "Info"

	return (
		<>
			<Link
				to={`entry/${entry.id}`}
				className={button({
					className: "hidden @lg:inline-flex",
				})}
			>
				{label}
				<M3.ButtonIcon>
					<MaterialSymbolsInfoOutline />
				</M3.ButtonIcon>
			</Link>
			<Link
				to={`entry/${entry.id}`}
				className={btnIcon({
					className: "@lg:hidden",
				})}
			>
				<span className="sr-only">{label}</span>
				<MaterialSymbolsInfoOutline />
				<TouchTarget />
			</Link>
		</>
	)
}

export function MockMediaListItem({
	...props
}: ComponentProps<"li">): ReactNode {
	return (
		<ListItem {...props}>
			<ListItemImg>
				<Skeleton full />
			</ListItemImg>
			<ListItemContent>
				<ListItemContentTitle>
					<Skeleton />
				</ListItemContentTitle>
				<ListItemContentSubtitle className="flex flex-wrap gap-1">
					<Skeleton className="max-w-[21.666666666666668ch]" />
				</ListItemContentSubtitle>
			</ListItemContent>
			<Skeleton />
		</ListItem>
	)
}

const MediaListItemTitle_entry = graphql`
	fragment MediaListItemTitle_entry on MediaList {
		id
		progress
		media @required(action: LOG) {
			id
			title @required(action: LOG) {
				userPreferred @required(action: LOG)
				...MediaTitle_mediaTitle
			}
		}
	}
`

function MediaListItemTitle(props: {
	entry: MediaListItemTitle_entry$key
}): ReactNode {
	const entry = useFragment(MediaListItemTitle_entry, props.entry)

	if (!entry) {
		return null
	}

	const libraryHasNextEpisode = (entry as any).libraryHasNextEpisode
	// library[entry.media.title.userPreferred]?.some(
	// 	({ episode }) => episode.number === (entry.progress || 0) + 1
	// )

	return (
		<>
			{libraryHasNextEpisode && (
				<MaterialSymbolsPriorityHigh className="i-inline inline text-primary" />

				// <span className="i-inline text-primary">video_library</span>
			)}
			<MediaTitle mediaTitle={entry.media.title} />
		</>
	)
}

const MediaListItemSubtitle_entry = graphql`
	fragment MediaListItemSubtitle_entry on MediaList {
		id
		score
		media {
			id
			type
			...ProgressTooltip_media
		}
		toWatch
		...Progress_entry
		...MediaListItemSort_entry
	}
`

function MediaListItemSubtitle(props: {
	entry: MediaListItemSubtitle_entry$key
}): ReactNode {
	const entry = useFragment(MediaListItemSubtitle_entry, props.entry)
	// const root = useRawRouteLoaderData<typeof rootLoader>("root")

	const watch = entry.toWatch

	const data = usePreloadedQuery(
		RootQuery,
		useRouteLoaderData<typeof rootLoader>("root")!.query
	)

	const params = useParams()

	return (
		<ListItemContentSubtitle className="flex flex-wrap gap-x-2">
			<div>
				<MaterialSymbolsStarOutline className="i-inline inline" />{" "}
				<div className="inline-block w-[3ch]">{entry.score}</div>
			</div>

			<div
				className={
					Predicate.isString(data.Viewer?.name) &&
					data.Viewer.name === params.userName
						? "contents @lg:hidden"
						: "contents"
				}
			>
				<div>
					<MaterialSymbolsPlayArrow className="i-inline inline" />{" "}
					<Progress entry={entry} />
				</div>
			</div>

			{entry.media?.type === ("ANIME" satisfies MediaType) &&
				Predicate.isNumber(watch) && (
					<div>
						<MaterialSymbolsTimerOutline className="i-inline inline" />{" "}
						{watch > 0
							? m.time_to_watch({ time: formatWatch(watch) })
							: m.nothing_to_watch()}
					</div>
				)}

			<MediaListItemSort entry={entry} />
		</ListItemContentSubtitle>
	)
}

const MediaListItemSort_user = graphql`
	fragment MediaListItemSort_user on User {
		id
		mediaListOptions {
			rowOrder
		}
	}
`

const MediaListItemSort_entry = graphql`
	fragment MediaListItemSort_entry on MediaList {
		id
		startedAt {
			local
		}
		completedAt {
			local
		}
		updatedAt
		media {
			id
			averageScore
			popularity
			startDate {
				local
			}
		}
	}
`

function MediaListItemSort(props: {
	entry: MediaListItemSort_entry$key
}): ReactNode {
	const entry = useFragment(MediaListItemSort_entry, props.entry)
	// const root = useRawRouteLoaderData<typeof rootLoader>("root")

	const query = useRouteLoaderData<typeof clientLoader>(
		"routes/_nav.user.$userName.$typelist"
	)

	const key: MediaListItemSort_user$key | null | undefined =
		query?.data?.MediaListCollection?.user
	const user = useFragment(MediaListItemSort_user, key)

	const searchParams = useOptimisticSearchParams()

	const sort =
		searchParams.get("sort") ??
		{
			score: MediaListSort.ScoreDesc,
			title: MediaListSort.TitleEnglish,
		}[String(user?.mediaListOptions?.rowOrder)]

	const children = {
		[MediaListSort.StartedOnDesc]: entry.startedAt?.local,
		[MediaListSort.StartDateDesc]: entry.media?.startDate?.local,
		[MediaListSort.FinishedOnDesc]: entry.completedAt?.local,
		[MediaListSort.UpdatedTimeDesc]: entry.updatedAt
			? format(entry.updatedAt - Date.now() / 1000)
			: null,
		[MediaListSort.AvgScore]: entry.media?.averageScore,
		[MediaListSort.PopularityDesc]: entry.media?.popularity
			? bigNumberformat(entry.media.popularity)
			: null,
	}[String(sort)]

	return (
		children && (
			<div>
				<MaterialSymbolsArrowDownward className="i-inline inline" /> {children}
			</div>
		)
	)
}

function bigNumberformat(number: number) {
	const rtf = new Intl.NumberFormat(sourceLanguageTag, {
		notation: "compact",
		maximumSignificantDigits: 3,
	})

	return rtf.format(number)
}

function format(seconds: number) {
	const rtf = new Intl.RelativeTimeFormat(sourceLanguageTag, {})

	if (Math.abs(seconds) < 60) {
		return rtf.format(Math.trunc(seconds), "seconds")
	}

	if (Math.abs(seconds) < 60 * 60) {
		return rtf.format(Math.trunc(seconds / 60), "minutes")
	}

	if (Math.abs(seconds) < 60 * 60 * 24) {
		return rtf.format(Math.trunc(seconds / (60 * 60)), "hours")
	}

	if (Math.abs(seconds) < 60 * 60 * 24 * 7) {
		return rtf.format(Math.trunc(seconds / (60 * 60 * 24)), "days")
	}

	if (Math.abs(seconds) < 60 * 60 * 24 * 365) {
		return rtf.format(Math.trunc(seconds / (60 * 60 * 24 * 7)), "weeks")
	}

	return rtf.format(Math.trunc(seconds / (60 * 60 * 24 * 365)), "years")
}
