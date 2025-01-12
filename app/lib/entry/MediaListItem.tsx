import { Link, useLocation, useNavigate, useParams } from "react-router"

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
import { useFragment, usePreloadedQuery } from "../Network"

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

import type { Route as SelectedRoute } from "../../routes/_nav.user.$userName.$typelist.($selected)/+types/route"
import { RootProvider } from "../RootProvider"

export function MediaListItem({
	entry,
	user,
	actionData,
	...props
}: ComponentProps<"div"> & {
	actionData: SelectedRoute.ComponentProps["actionData"] | undefined
	entry: MediaListItem_entry$key
	user: MediaListItemScore_user$key | null | undefined
}): ReactNode {
	const data = useFragment(MediaListItem_entry, entry)

	const list = use(ListContext)
	const navigate = useNavigate()

	const { search } = useLocation()

	const loadSidePanel = () => {
		const xl = window.innerWidth >= 1600
		xl &&
			data &&
			void navigate(
				{
					pathname: `entry/${data.id}`,
					search: search,
				},
				{
					replace: true,
				}
			)
	}

	return (
		data && (
			<div
				{...props}
				className={list.item({
					className: props.className,
				})}
				onMouseEnter={loadSidePanel}
				onFocus={loadSidePanel}
			>
				<ListItemImg>
					<MediaCover media={data.media} />
				</ListItemImg>

				<Link
					to={route_media({ id: data.media.id })}
					className={list.itemContent({ className: "flex-[5]" })}
				>
					<ListItemContentTitle>
						<MediaListItemTitle entry={data} />
					</ListItemContentTitle>
					<MediaListItemSubtitle
						entry={data}
						user={user}
						actionData={actionData}
					/>
				</Link>

				<M3.ListItemContent className="hidden flex-[2] @xl:block">
					<M3.ListItemContentSubtitle className="justify-start font-mono">
						<MediaListItemDate entry={data} />
					</M3.ListItemContentSubtitle>
				</M3.ListItemContent>

				<M3.ListItemContent className="hidden flex-1 @xl:block">
					<M3.ListItemContentSubtitle className="justify-center font-mono">
						<MediaListScore entry={data} user={user} />
					</M3.ListItemContentSubtitle>
				</M3.ListItemContent>

				<M3.ListItemContent className="hidden flex-1 @lg:block">
					<M3.ListItemContentSubtitle className="justify-center font-mono">
						<Progress entry={data} actionData={actionData} />
					</M3.ListItemContentSubtitle>
				</M3.ListItemContent>

				<div className="flex">
					<ProgressIncrement entry={data} actionData={actionData} />
					<Info entry={data} />
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
				<MaterialSymbolsSentimentDissatisfiedOutline className="i-inline text-error @xl:i inline" />
			),
			2: (
				<MaterialSymbolsSentimentNeutralOutline className="i-inline text-tertiary @xl:i inline" />
			),
			3: (
				<MaterialSymbolsSentimentSatisfiedOutline className="i-inline text-primary @xl:i inline" />
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

function Info(props: { entry: MediaListItemInfo_entry$key }): ReactNode {
	const entry = useFragment(MediaListItemInfo_entry, props.entry)
	const root = usePreloadedQuery(...use(RootProvider).rootQuery)
	const params = useParams()

	const viewerIsUser =
		Predicate.isString(root.Viewer?.name) &&
		root.Viewer.name === params.userName
	const label = viewerIsUser ? "Edit" : "Info"

	const { search } = useOptimisticLocation()

	return (
		<>
			<Link
				to={{
					pathname: `entry/${entry.id}`,
					search: search,
				}}
				className={button({
					className: "xl:pointer-fine:hidden hidden @lg:inline-flex",
				})}
			>
				{label}
				<M3.ButtonIcon>
					<MaterialSymbolsInfoOutline />
				</M3.ButtonIcon>
			</Link>
			<Link
				to={{
					pathname: `entry/${entry.id}`,
					search: search,
				}}
				className={btnIcon({
					className: "xl:pointer-fine:hidden @lg:hidden",
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
			<ListItemContent className="flex-[5]">
				<ListItemContentTitle>
					<Skeleton />
				</ListItemContentTitle>
				<ListItemContentSubtitle className="flex flex-wrap gap-1">
					<Skeleton className="max-w-[21.666666666666668ch]" />
				</ListItemContentSubtitle>
			</ListItemContent>

			<ListItemContent className="hidden flex-1 @xl:block">
				<ListItemContentSubtitle className="flex flex-wrap gap-1">
					<Skeleton className="max-w-[21.666666666666668ch]" />
				</ListItemContentSubtitle>
			</ListItemContent>

			<ListItemContent className="hidden flex-1 @lg:block">
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
				<MaterialSymbolsPriorityHigh className="i-inline text-primary inline" />

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
function MediaListItemSubtitle(props: {
	entry: MediaListItemSubtitle_entry$key
	user: MediaListItemScore_user$key | null | undefined
	actionData: SelectedRoute.ComponentProps["actionData"] | undefined
}): ReactNode {
	const entry = useFragment(MediaListItemSubtitle_entry, props.entry)

	const watch = entry.toWatch

	const root = usePreloadedQuery(...use(RootProvider).rootQuery)

	const params = useParams()

	return (
		<ListItemContentSubtitle className="flex justify-between gap-x-2 @lg:justify-start">
			<div className="@xl:hidden">
				Score:{" "}
				<div className="inline-block font-mono">
					<MediaListScore entry={entry} user={props.user} />
				</div>
			</div>

			<div
				className={
					Predicate.isString(root.Viewer?.name) &&
					root.Viewer.name === params.userName
						? "contents @lg:hidden"
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
					<div className="hidden @xl:block">
						<MaterialSymbolsTimerOutline className="i-inline inline" />{" "}
						{watch > 0
							? m.time_to_watch({ time: formatWatch(watch) })
							: m.nothing_to_watch()}
					</div>
				)}
		</ListItemContentSubtitle>
	)
}
