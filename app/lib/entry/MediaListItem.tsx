import { Link } from "@remix-run/react"

import { Skeleton } from "~/components/Skeleton"
import { m } from "~/lib/paraglide"

import ReactRelay from "react-relay"

import type { AnitomyResult } from "anitomy"
import type { NonEmptyArray } from "effect/Array"
import type { ReactNode } from "react"
import { createContext, useContext } from "react"
import {
    ListItem,
    ListItemContent,
    ListItemContentSubtitle,
    ListItemContentTitle,
    ListItemImg
} from "~/components/List"
import MaterialSymbolsPriorityHigh from "~icons/material-symbols/priority-high"

import { route_media } from "../route"
import { MediaCover } from "./MediaCover"
import { formatWatch } from "./ToWatch"

import MaterialSymbolsStarOutline from "~icons/material-symbols/star-outline"
import MaterialSymbolsTimerOutline from "~icons/material-symbols/timer-outline"
import { ProgressIncrement } from "./Progress"

import type { SerializeFrom } from "@remix-run/node"
import { Predicate } from "effect"
import type { MediaListItem_entry$key } from "~/gql/MediaListItem_entry.graphql"
import type {
    MediaListItemSubtitle_entry$key,
    MediaType
} from "~/gql/MediaListItemSubtitle_entry.graphql"
import type { MediaListItemTitle_entry$key } from "~/gql/MediaListItemTitle_entry.graphql"
import { useFragment } from "../Network"

const { graphql } = ReactRelay

const MediaListItem_entry = graphql`
	fragment MediaListItem_entry on MediaList {
		...ProgressIncrement_entry
		...MediaListItemTitle_entry
		...MediaListItemSubtitle_entry
		media {
			id
			...MediaCover_media
		}
	}
`

export type ListItem_EntryFragment = typeof MediaListItem_entry
export const Library = createContext<
	SerializeFrom<Record<string, NonEmptyArray<AnitomyResult>>>
>({})

export function MediaListItem(props: {
	entry: MediaListItem_entry$key | null
}): ReactNode {
	const entry = useFragment(MediaListItem_entry, props.entry)

	return (
		<li className="col-span-full grid grid-cols-subgrid">
			<ListItem render={<div />}>
				<ListItemImg>
					<Skeleton full>
						{entry?.media ? <MediaCover media={entry.media} /> : null}
					</Skeleton>
				</ListItemImg>
				<ListItemContent
					render={
						entry?.media ? (
							<Link
								unstable_viewTransition
								to={route_media({ id: entry.media.id })}
							/>
						) : (
							<div />
						)
					}
				>
					<ListItemContentTitle>
						<Skeleton>{entry && <MediaListItemTitle entry={entry} />}</Skeleton>
					</ListItemContentTitle>
					<ListItemContentSubtitle className="flex flex-wrap gap-1">
						<Skeleton className="force:max-w-[21.666666666666668ch]">
							{entry && <MediaListItemSubtitle entry={entry} />}
						</Skeleton>
					</ListItemContentSubtitle>
				</ListItemContent>

				<Skeleton>{entry && <ProgressIncrement entry={entry} />}</Skeleton>
			</ListItem>
		</li>
	)
}

const MediaListItemTitle_entry = graphql`
	fragment MediaListItemTitle_entry on MediaList {
		id
		progress
		media @required(action: LOG) {
			title @required(action: LOG) {
				userPreferred @required(action: LOG)
			}
		}
	}
`

function MediaListItemTitle(props: {
	entry: MediaListItemTitle_entry$key
}): ReactNode {
	const entry = useFragment(MediaListItemTitle_entry, props.entry)
	const library = useContext(Library)

	if (!entry) {
		return null
	}

	const libraryHasNextEpisode = library[entry.media.title.userPreferred]?.some(
		({ episode }) => episode.number === (entry.progress || 0) + 1
	)

	return (
		<>
			{libraryHasNextEpisode && (
				<MaterialSymbolsPriorityHigh className="i-inline inline text-primary" />

				// <span className="i-inline text-primary">video_library</span>
			)}
			{entry.media.title.userPreferred}
		</>
	)
}

const MediaListItemSubtitle_entry = graphql`
	fragment MediaListItemSubtitle_entry on MediaList {
		id
		score
		toWatch
		...Progress_entry
		media {
			id
			type
		}
	}
`

function MediaListItemSubtitle(props: {
	entry: MediaListItemSubtitle_entry$key
}): ReactNode {
	const entry = useFragment(MediaListItemSubtitle_entry, props.entry)
	// const root = useRawRouteLoaderData<typeof rootLoader>("root")

	const watch = entry.toWatch
	return (
		<>
			<div>
				<MaterialSymbolsStarOutline className="i-inline inline" /> {entry.score}
			</div>

			{entry.media?.type === ("ANIME" satisfies MediaType) &&
				Predicate.isNumber(watch) && (
					<>
						&middot;
						<div>
							<MaterialSymbolsTimerOutline className="i-inline inline" />{" "}
							{watch > 0
								? m.time_to_watch({ time: formatWatch(watch) })
								: m.nothing_to_watch()}
						</div>
					</>
				)}
		</>
	)
}
