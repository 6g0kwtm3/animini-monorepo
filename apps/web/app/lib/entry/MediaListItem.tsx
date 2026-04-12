import { Skeleton } from "~/components/Skeleton"
import { m } from "~/lib/paraglide"

import ReactRelay from "react-relay"

import type { ReactNode } from "react"
import { useContext } from "react"
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
import MaterialSymbolsVisibilityOff from "~icons/material-symbols/visibility-off"
import { ProgressIncrement } from "./Progress"

import { A } from "@anitrove/a"
import { media, utilities } from "@anitrove/design"
import {
	mergeStyles,
	precompileStyles,
	type PreCompiledStyles,
} from "@anitrove/unstyled"
import type { MediaListItem_entry$key } from "~/gql/MediaListItem_entry.graphql"
import { Box } from "@anitrove/unstyled/box"
import { Badge } from "~/components/Badge"
import type {
	MediaListItemSubtitle_entry$key,
	MediaType,
} from "~/gql/MediaListItemSubtitle_entry.graphql"
import type { MediaListItemTitle_entry$key } from "~/gql/MediaListItemTitle_entry.graphql"
import * as Predicate from "~/lib/Predicate"
import { useFragment } from "../Network"
import { Library } from "./Library"

const { graphql } = ReactRelay

const MediaListItem_entry = graphql`
	fragment MediaListItem_entry on MediaList {
		id
		...ProgressIncrement_entry
		...MediaListItemTitle_entry
		...MediaListItemSubtitle_entry
		private
		media {
			id
			...MediaCover_media
			coverImage {
				theme
			}
		}
	}
`

	style?: PreCompiledStyles
export function MediaListItem(props: {
	entry: MediaListItem_entry$key | null
}): ReactNode {
	const entry = useFragment(MediaListItem_entry, props.entry)

	return (
		<li className="col-span-full grid grid-cols-subgrid">
			<ListItem
				data-testid="media-list-item"
				style={mergeStyles(
					entry?.media?.coverImage?.theme ?? undefined,
					precompileStyles({
						gridColumn: "1 / -1",
						display: "grid",
						gridTemplateColumns: "subgrid",
						...utilities.theme({
							[media.hover]: { default: "light", [media.dark]: "dark" },
							[media.focusWithin]: { default: "light", [media.dark]: "dark" },
						}),
						...utilities.contrast({
							[media.hover]: { default: "standard", [media.dark]: "high" },
							[media.focusWithin]: {
								default: "standard",
								[media.dark]: "high",
							},
						}),
					}),
					props.style
				)}
			>
				<Box style={precompileStyles({ position: "relative" })}>
					<ListItemImg>
						<Skeleton full>
							{entry?.media ? <MediaCover media={entry.media} /> : null}
						</Skeleton>
					</ListItemImg>
					{entry?.private ? (
						<Badge>
							<MaterialSymbolsVisibilityOff></MaterialSymbolsVisibilityOff>
						</Badge>
					) : null}
				</Box>
				<ListItemContent
					render={
						<A
							href={entry?.media ? route_media({ id: entry.media.id }) : ""}
						></A>
					}
				>
					<ListItemContentTitle>
						<Skeleton>
							{entry ? <MediaListItemTitle entry={entry} /> : null}
						</Skeleton>
					</ListItemContentTitle>
					<ListItemContentSubtitle
						style={precompileStyles({
							display: "flex",
							flexWrap: "wrap",
							gap: ".25rem",
						})}
					>
						<Skeleton className="max-w-[21.666666666666668ch]">
							{entry ? <MediaListItemSubtitle entry={entry} /> : null}
						</Skeleton>
					</ListItemContentSubtitle>
				</ListItemContent>

				<Skeleton>
					{entry ? <ProgressIncrement entry={entry} /> : null}
				</Skeleton>
			</ListItem>
		</li>
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
		({ episode }) => episode.number === (entry.progress ?? 0) + 1
	)

	return (
		<>
			{libraryHasNextEpisode ? (
				<MaterialSymbolsPriorityHigh className="i-inline text-primary inline" />
			) : null}
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

			{entry.media?.type === ("ANIME" satisfies MediaType)
				&& Predicate.isNumber(watch) && (
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
