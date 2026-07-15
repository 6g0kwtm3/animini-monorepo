import { Skeleton } from "~/components/Skeleton"
import { m } from "~/lib/paraglide"

import ReactRelay from "react-relay"

import type { ReactNode } from "react"
import {
	ListItem,
	ListItemContent,
	ListItemContentSubtitle,
	ListItemContentTitle,
	ListItemImg,
} from "~/components/List"

import MaterialSymbolsStarOutline from "~icons/material-symbols/star-outline"
import MaterialSymbolsTimerOutline from "~icons/material-symbols/timer-outline"
import MaterialSymbolsVisibilityOff from "~icons/material-symbols/visibility-off"
import { route_media } from "../route"
import { MediaCover } from "./MediaCover"
import { formatWatch } from "./ToWatch"

import { A } from "@anitrove/a"
import {
	mergeStyles,
	type OutStyles
} from "@anitrove/unstyled"
import { CompositeItem, CompositeRow } from "@ariakit/react"
import type { MediaListItem_entry$key } from "~/gql/MediaListItem_entry.graphql"
import type { MediaListItem_media$key } from "~/gql/MediaListItem_media.graphql"

import { Box } from "@anitrove/unstyled/box"
import { Badge } from "~/components/Badge"
import type {
	MediaListItemSubtitle_entry$key,
	MediaType,
} from "~/gql/MediaListItemSubtitle_entry.graphql"
import * as Predicate from "~/lib/Predicate"
import { useFragment } from "../Network"
import { styles } from "./MediaListItem.styles" with { type: "macro" }
import { MediaTitle } from "./MediaTitle"

const { graphql } = ReactRelay

const MediaListItem_entry = graphql`
	fragment MediaListItem_entry on MediaList {
		id
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

const MediaListItem_media = graphql`
	fragment MediaListItem_media on Media {
		id
		...MediaCover_media
		...MediaTitle_media
		coverImage {
			theme
		}
	}
`

export function MediaListItem({
	entry: entryKey,
	media: mediaKey,
	children,
	...props
}: {
	children?: ReactNode
	entry: MediaListItem_entry$key | null | undefined
	media: MediaListItem_media$key

	style?: OutStyles
}): ReactNode {
	const entry = useFragment(MediaListItem_entry, entryKey)
	const data = useFragment(MediaListItem_media, mediaKey)

	return (
		<ListItem
			data-testid="media-list-item"
			style={mergeStyles(
				data.coverImage?.theme ?? undefined,
				styles.item,
				props.style
			)}
			render={<CompositeRow></CompositeRow>}
		>
			<Box style={styles.avatar}>
				<ListItemImg>
					<Skeleton full>
						<MediaCover media={data} />
					</Skeleton>
				</ListItemImg>
				{entry?.private ? (
					<Badge data-testid="private-badge">
						<MaterialSymbolsVisibilityOff></MaterialSymbolsVisibilityOff>
					</Badge>
				) : null}
			</Box>
			<ListItemContent
				render={
					<CompositeItem
						render={<A href={route_media({ id: Number(data.id) })}></A>}
					/>
				}
			>
				<ListItemContentTitle>
					<Skeleton>
						<MediaTitle media={data}></MediaTitle>
					</Skeleton>
				</ListItemContentTitle>
				<ListItemContentSubtitle style={styles.subtitle}>
					<Skeleton className="max-w-[21.666666666666668ch]">
						{entry ? <MediaListItemSubtitle entry={entry} /> : null}
					</Skeleton>
				</ListItemContentSubtitle>
			</ListItemContent>
			{children}
		</ListItem>
	)
}

const MediaListItemSubtitle_entry = graphql`
	fragment MediaListItemSubtitle_entry on MediaList {
		id
		score
		toWatch
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
