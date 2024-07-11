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
import { Progress, ProgressIncrement, ProgressTooltip } from "./Progress"

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
import { useFragment } from "../Network"

import type { clientLoader as rootLoader } from "~/root"

import MaterialSymbolsEditSquareOutline from "~icons/material-symbols/edit-square-outline"
import MaterialSymbolsInfoOutline from "~icons/material-symbols/info-outline"

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
					<Info />
				</div>
				{/* <MoreMenu entry={data} /> */}
			</ListItem>
		)
	)
}

function Info(): ReactNode {
	const data = useRouteLoaderData<typeof rootLoader>("root")
	const params = useParams()

	return Predicate.isString(data?.Viewer?.name) &&
		data.Viewer.name === params.userName ? (
		<>
			<div className="hidden @lg:block">
				<M3.Button>
					Edit
					<M3.ButtonIcon>
						<MaterialSymbolsEditSquareOutline />
					</M3.ButtonIcon>
				</M3.Button>
			</div>
			<div className="@lg:hidden">
				<M3.Icon>
					<span className="sr-only">Edit</span>
					<MaterialSymbolsEditSquareOutline />
				</M3.Icon>
			</div>
		</>
	) : (
		<>
			<div className="hidden @lg:block">
				<M3.Button>
					Info
					<M3.ButtonIcon>
						<MaterialSymbolsInfoOutline />
					</M3.ButtonIcon>
				</M3.Button>
			</div>
			<div className="@lg:hidden">
				<M3.Icon>
					<span className="sr-only">Info</span>
					<MaterialSymbolsInfoOutline />
				</M3.Icon>
			</div>
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
	}
`
function MediaListItemSubtitle(props: {
	entry: MediaListItemSubtitle_entry$key
}): ReactNode {
	const entry = useFragment(MediaListItemSubtitle_entry, props.entry)
	// const root = useRawRouteLoaderData<typeof rootLoader>("root")

	const watch = entry.toWatch
	return (
		<ListItemContentSubtitle className="flex flex-wrap gap-x-2">
			<div>
				<MaterialSymbolsStarOutline className="i-inline inline" />{" "}
				<div className="inline-block w-[3ch]">{entry.score}</div>
			</div>

			<M3.TooltipPlain>
				<M3.TooltipPlainTrigger className="contents @lg:hidden">
					<div>
						<MaterialSymbolsPlayArrow className="i-inline inline" />{" "}
						<Progress entry={entry} />
					</div>
				</M3.TooltipPlainTrigger>
				{entry.media && <ProgressTooltip media={entry.media} />}
			</M3.TooltipPlain>

			{entry.media?.type === ("ANIME" satisfies MediaType) &&
				Predicate.isNumber(watch) && (
					<div>
						<MaterialSymbolsTimerOutline className="i-inline inline" />{" "}
						{watch > 0
							? m.time_to_watch({ time: formatWatch(watch) })
							: m.nothing_to_watch()}
					</div>
				)}
		</ListItemContentSubtitle>
	)
}
