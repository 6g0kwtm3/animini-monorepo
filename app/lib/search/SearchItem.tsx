import { Link } from "@remix-run/react"
import { serverOnly$ } from "vite-env-only"
import {
	ListItem,
	ListItemAvatar,
	ListItemContent,
	ListItemContentTitle,
	ListItemTrailingSupportingText
} from "~/components/List"
import { SearchViewItem } from "~/components/SearchView"
import type { FragmentType } from "~/lib/graphql"
import { graphql, useFragment } from "~/lib/graphql"
import { MediaCover } from "../entry/MediaListCover"
import { route_media } from "../route"

const SearchItem_media = serverOnly$(
	graphql(`
		fragment SearchItem_media on Media {
			id
			type
			...MediaCover_media
			title {
				userPreferred
			}
		}
	`)
)

export type SearchItem_media = typeof SearchItem_media

export function SearchItem(props: {
	media: FragmentType<typeof SearchItem_media>
}) {
	const media = useFragment<typeof SearchItem_media>(props.media)

	return (
		<SearchViewItem
			render={
				<ListItem
					render={
						<Link
							to={route_media({ id: media.id })}
							title={media.title?.userPreferred ?? undefined}
						/>
					}
				/>
			}
		>
			<ListItemAvatar>
				<MediaCover media={media} />
			</ListItemAvatar>

			<ListItemContent>
				<ListItemContentTitle>
					{media.title?.userPreferred}
				</ListItemContentTitle>
			</ListItemContent>

			{media.type && (
				<ListItemTrailingSupportingText>
					{media.type.toLowerCase()}
				</ListItemTrailingSupportingText>
			)}
		</SearchViewItem>
	)
}
