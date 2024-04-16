import { Link } from "@remix-run/react"

import { Skeleton } from "~/components/Skeleton"
import { m } from "~/lib/paraglide"

import type { FragmentType } from "~/lib/graphql"
import { graphql, readFragment } from "~/lib/graphql"

import type { AnitomyResult } from "anitomy"
import type { NonEmptyArray } from "effect/ReadonlyArray"
import type { ReactNode } from "react"
import { createContext, useContext } from "react"
import { serverOnly$ } from "vite-env-only"
import {
	ListItem,
	ListItemContent,
	ListItemContentSubtitle,
	ListItemContentTitle,
	ListItemImg
} from "~/components/List"
import MaterialSymbolsPriorityHigh from "~icons/material-symbols/priority-high"

import { route_media } from "../route"
import { MediaCover } from "./MediaListCover"
import { formatWatch, toWatch } from "./toWatch"

import { MediaType } from "~/gql/graphql"
import MaterialSymbolsStarOutline from "~icons/material-symbols/star-outline"
import MaterialSymbolsTimerOutline from "~icons/material-symbols/timer-outline"
import { IncrementProgress } from "./Progress"

import type { SerializeFrom } from "@remix-run/cloudflare"
import { Predicate } from "effect"

const MediaListItem_entry = serverOnly$(
	graphql(`
		fragment ListItem_entry on MediaList {
			...IncrementProgress_entry
			...MediaListItemTitle_entry
			...MediaListItemSubtitle_entry
			media {
				id
				...MediaCover_media
			}
		}
	`)
)

export type ListItem_EntryFragment = typeof MediaListItem_entry
export const Library = createContext<
	SerializeFrom<Record<string, NonEmptyArray<AnitomyResult>>>
>({})

export function MediaListItem(props: {
	entry: FragmentType<typeof MediaListItem_entry> | null
}): ReactNode {
	const entry = readFragment<typeof MediaListItem_entry>(props.entry)

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

				<Skeleton>{entry && <IncrementProgress entry={entry} />}</Skeleton>
			</ListItem>
		</li>
	)
}

const MediaListItemTitle_entry = serverOnly$(
	graphql(`
		fragment MediaListItemTitle_entry on MediaList {
			id
			progress
			media {
				title {
					userPreferred
				}
			}
		}
	`)
)

function MediaListItemTitle(props: {
	entry: FragmentType<typeof MediaListItemTitle_entry>
}): ReactNode {
	const entry = readFragment<typeof MediaListItemTitle_entry>(props.entry)
	const library = useContext(Library)[entry.media?.title?.userPreferred ?? ""]

	const libraryHasNextEpisode = library?.some(
		({ episode }) => episode.number === (entry.progress || 0) + 1
	)

	return (
		<>
			{libraryHasNextEpisode && (
				<MaterialSymbolsPriorityHigh className="i-inline inline text-primary" />

				// <span className="i-inline text-primary">video_library</span>
			)}
			{entry.media?.title?.userPreferred}
		</>
	)
}

const MediaListItemSubtitle_entry = serverOnly$(
	graphql(`
		fragment MediaListItemSubtitle_entry on MediaList {
			id
			score
			...ToWatch_entry
			...Progress_entry
			media {
				id
				type
			}
		}
	`)
)

function MediaListItemSubtitle(props: {
	entry: FragmentType<typeof MediaListItemSubtitle_entry>
}): ReactNode {
	const entry = readFragment<typeof MediaListItemSubtitle_entry>(props.entry)
	// const root = useRawRouteLoaderData<typeof rootLoader>("root")

	const watch = toWatch(entry)
	return (
		<>
			<div>
				<MaterialSymbolsStarOutline className="i-inline inline" /> {entry.score}
			</div>

			{entry.media?.type === MediaType.Anime && Predicate.isNumber(watch) && (
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
