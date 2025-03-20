import { useLocation, useNavigate, useParams } from "react-router"

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

import MaterialSymbolsTimerOutline from "~icons/material-symbols/timer-outline"
import { Progress, ProgressIncrement } from "./Progress"

import type { MediaListItem_entry$key } from "~/gql/MediaListItem_entry.graphql"
import type {
	MediaListItemSubtitle_entry$key,
	MediaType,
} from "~/gql/MediaListItemSubtitle_entry.graphql"
import type { MediaListItemTitle_entry$key } from "~/gql/MediaListItemTitle_entry.graphql"
import * as Predicate from "~/lib/Predicate"
import { M3 } from "../components"
import { ListContext } from "../list"
import { MediaTitle } from "../MediaTitle"
import { useFragment } from "../Network"

import { TouchTarget } from "~/components"
import type { MediaListItemInfo_entry$key } from "~/gql/MediaListItemInfo_entry.graphql"
import type { MediaListItemScore_entry$key } from "~/gql/MediaListItemScore_entry.graphql"
import type { MediaListItemScore_user$key } from "~/gql/MediaListItemScore_user.graphql"
import MaterialSymbolsInfoOutline from "~icons/material-symbols/info-outline"
import { btnIcon, button } from "../button"
import { useOptimisticLocation } from "../search/useOptimisticSearchParams"

import MaterialSymbolsSentimentNeutralOutline from "~icons/material-symbols/sentiment-neutral-outline"
import MaterialSymbolsSentimentSatisfiedOutline from "~icons/material-symbols/sentiment-satisfied-outline"

import { formatDateRange } from "little-date"
import type { MediaListItemDate_entry$key } from "~/gql/MediaListItemDate_entry.graphql"
import MaterialSymbolsSentimentDissatisfiedOutline from "~icons/material-symbols/sentiment-dissatisfied-outline"

import type { MediaListItem_viewer$key } from "~/gql/MediaListItem_viewer.graphql"
import type { MediaListItemInfo_viewer$key } from "~/gql/MediaListItemInfo_viewer.graphql"
import type { MediaListItemSubtitle_viewer$key } from "~/gql/MediaListItemSubtitle_viewer.graphql"
import type { Route as SelectedRoute } from "../../routes/UserListSelected/+types/route"

const { graphql } = ReactRelay

export type ListItem_EntryFragment = typeof MediaListItem_entry

const MediaListItem_entry = graphql`
	fragment MediaListItem_entry on MediaList {
		id
		media @required(action: LOG) {
			id
			...MediaCover_media
		}
		...MediaListItemDate_entry
		...ProgressIncrement_entry
		...Progress_entry
		...MediaListItemTitle_entry
		...MediaListItemSubtitle_entry
		...MediaListItemInfo_entry
		...MediaListItemScore_entry
	}
`

const MediaListItem_viewer = graphql`
	fragment MediaListItem_viewer on User {
		id
		...MediaListItemSubtitle_viewer
		...MediaListItemInfo_viewer
		...ProgressIncrement_viewer
	}
`

// function useMedia(query: string) {
// 	const media = window.matchMedia(query)
// 	return useSyncExternalStore(
// 		(cb) => {
// 			media.addEventListener("change", cb)
// 			return () => media.removeEventListener("change", cb)
// 		},
// 		() => media.matches,
// 		() => media.matches
// 	)
// }

export function MediaListItem({
	entry: entryKey,
	user,
	actionData,
	viewer: viewerKey,
	...props
}: ComponentProps<"div"> & {
	actionData: SelectedRoute.ComponentProps["actionData"] | undefined
	entry: MediaListItem_entry$key
	user: MediaListItemScore_user$key | null | undefined
	viewer: MediaListItem_viewer$key | null | undefined
}): ReactNode {
	const entry = useFragment(MediaListItem_entry, entryKey)
	const viewer = useFragment(MediaListItem_viewer, viewerKey)

	const list = use(ListContext)
	const navigate = useNavigate()

	const { search } = useLocation()

	const loadSidePanel = () => {
		const xl = window.innerWidth >= 1600
		xl &&
			entry &&
			void navigate(
				{
					pathname: `entry/${entry.id}`,
					search: search,
				},
				{
					replace: true,
				}
			)
	}

	return (
		entry && (
			<div
				{...props}
				className={list.item({
					className: props.className,
				})}
				onMouseEnter={loadSidePanel}
				onFocus={loadSidePanel}
			>
				<ListItemImg>
					<MediaCover media={entry.media} />
				</ListItemImg>

				<M3.Link
					to={route_media({ id: entry.media.id })}
					className={list.itemContent({ className: "flex-[5]" })}
				>
					<ListItemContentTitle>
						<MediaListItemTitle entry={entry} />
					</ListItemContentTitle>
					<MediaListItemSubtitle
						entry={entry}
						user={user}
						actionData={actionData}
						viewer={viewer}
					/>
				</M3.Link>

				<M3.ListItemContent className="@xl:block hidden flex-[2]">
					<M3.ListItemContentSubtitle className="justify-start font-mono">
						<MediaListItemDate entry={entry} />
					</M3.ListItemContentSubtitle>
				</M3.ListItemContent>

				<M3.ListItemContent className="@xl:block hidden flex-1">
					<M3.ListItemContentSubtitle className="justify-center font-mono">
						<MediaListScore entry={entry} user={user} />
					</M3.ListItemContentSubtitle>
				</M3.ListItemContent>

				<M3.ListItemContent className="@lg:block hidden flex-1">
					<M3.ListItemContentSubtitle className="justify-center font-mono">
						<Progress entry={entry} actionData={actionData} />
					</M3.ListItemContentSubtitle>
				</M3.ListItemContent>

				<div className="flex">
					<ProgressIncrement
						entry={entry}
						actionData={actionData}
						viewer={viewer}
					/>
					<Info entry={entry} viewer={viewer} />
				</div>
				{/* <MoreMenu entry={data} /> */}
			</div>
		)
	)
}

const MediaListItemDate_entry = graphql`
	fragment MediaListItemDate_entry on MediaList {
		id
		completedAt {
			date @required(action: LOG)
		}
		startedAt {
			date @required(action: LOG)
		}
	}
`

function MediaListItemDate(props: { entry: MediaListItemDate_entry$key }) {
	const entry = useFragment(MediaListItemDate_entry, props.entry)

	const startedAt = entry.startedAt?.date ?? entry.completedAt?.date
	const completedAt = entry.completedAt?.date ?? entry.startedAt?.date

	return (
		startedAt &&
		completedAt && (
			<time dateTime="">
				{!entry.startedAt?.date && " - "}
				{formatDateRange(startedAt, completedAt, {
					includeTime: false,
				})}
				{!entry.completedAt?.date && " - "}
			</time>
		)
	)
}

const MediaListItemScore_entry = graphql`
	fragment MediaListItemScore_entry on MediaList {
		id
		score
	}
`

const MediaListItemScore_user = graphql`
	fragment MediaListItemScore_user on User {
		id
		mediaListOptions {
			scoreFormat
		}
	}
`

function MediaListScore(props: {
	entry: MediaListItemScore_entry$key
	user: MediaListItemScore_user$key | null | undefined
}): ReactNode {
	const entry = useFragment(MediaListItemScore_entry, props.entry)
	const user = useFragment(MediaListItemScore_user, props.user)

	if (typeof entry.score !== "number") {
		return null
	}

	if (user?.mediaListOptions?.scoreFormat === "POINT_3") {
		return {
			1: (
				<MaterialSymbolsSentimentDissatisfiedOutline className="@xl:i i-inline inline text-error" />
			),
			2: (
				<MaterialSymbolsSentimentNeutralOutline className="@xl:i i-inline inline text-tertiary" />
			),
			3: (
				<MaterialSymbolsSentimentSatisfiedOutline className="@xl:i i-inline inline text-primary" />
			),
		}[entry.score]
	}

	return entry.score
}
const MediaListItemInfo_entry = graphql`
	fragment MediaListItemInfo_entry on MediaList {
		id
	}
`

const MediaListItemInfo_viewer = graphql`
	fragment MediaListItemInfo_viewer on User {
		id
		name
	}
`

function Info(props: {
	entry: MediaListItemInfo_entry$key
	viewer: MediaListItemInfo_viewer$key | null | undefined
}): ReactNode {
	const entry = useFragment(MediaListItemInfo_entry, props.entry)
	const viewer = useFragment(MediaListItemInfo_viewer, props.viewer)
	const params = useParams()

	const viewerIsUser =
		Predicate.isString(viewer?.name) && viewer.name === params.userName
	const label = viewerIsUser ? "Edit" : "Info"

	const { search } = useOptimisticLocation()

	return (
		<>
			<M3.Link
				to={{
					pathname: `entry/${entry.id}`,
					search: search,
				}}
				className={button({
					className: "@lg:inline-flex hidden xl:pointer-fine:hidden",
				})}
			>
				{label}
				<M3.ButtonIcon>
					<MaterialSymbolsInfoOutline />
				</M3.ButtonIcon>
			</M3.Link>
			<M3.Link
				to={{
					pathname: `entry/${entry.id}`,
					search: search,
				}}
				className={btnIcon({
					className: "@lg:hidden xl:pointer-fine:hidden",
				})}
			>
				<span className="sr-only">{label}</span>
				<MaterialSymbolsInfoOutline />
				<TouchTarget />
			</M3.Link>
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
			<ListItemContent className="flex-[5]">
				<ListItemContentTitle>
					<Skeleton />
				</ListItemContentTitle>
				<ListItemContentSubtitle className="flex flex-wrap gap-1">
					<Skeleton className="max-w-[21.666666666666668ch]" />
				</ListItemContentSubtitle>
			</ListItemContent>

			<ListItemContent className="@xl:block hidden flex-1">
				<ListItemContentSubtitle className="flex flex-wrap gap-1">
					<Skeleton className="max-w-[21.666666666666668ch]" />
				</ListItemContentSubtitle>
			</ListItemContent>

			<ListItemContent className="@lg:block hidden flex-1">
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
		...MediaListItemScore_entry
	}
`

const MediaListItemSubtitle_viewer = graphql`
	fragment MediaListItemSubtitle_viewer on User {
		id
		name
	}
`

function MediaListItemSubtitle(props: {
	entry: MediaListItemSubtitle_entry$key
	user: MediaListItemScore_user$key | null | undefined
	actionData: SelectedRoute.ComponentProps["actionData"] | undefined
	viewer: MediaListItemSubtitle_viewer$key | null | undefined
}): ReactNode {
	const entry = useFragment(MediaListItemSubtitle_entry, props.entry)
	const viewer = useFragment(MediaListItemSubtitle_viewer, props.viewer)

	const watch = entry.toWatch

	const params = useParams()

	return (
		<ListItemContentSubtitle className="@lg:justify-start flex justify-between gap-x-2">
			<div className="@xl:hidden">
				Score:{" "}
				<div className="inline-block font-mono">
					<MediaListScore entry={entry} user={props.user} />
				</div>
			</div>

			<div
				className={
					Predicate.isString(viewer?.name) && viewer.name === params.userName
						? "@lg:hidden contents"
						: "contents"
				}
			>
				<div className="@lg:hidden">
					Progress:{" "}
					<Progress
						className="font-mono"
						entry={entry}
						actionData={props.actionData}
					/>
				</div>
			</div>
			{entry.media?.type === ("ANIME" satisfies MediaType) &&
				Predicate.isNumber(watch) && (
					<div className="@xl:block hidden">
						<MaterialSymbolsTimerOutline className="i-inline inline" />{" "}
						{watch > 0
							? m.time_to_watch({ time: formatWatch(watch) })
							: m.nothing_to_watch()}
					</div>
				)}
		</ListItemContentSubtitle>
	)
}
