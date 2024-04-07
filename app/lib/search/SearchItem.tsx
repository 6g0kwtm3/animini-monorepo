import { Link } from "@remix-run/react"
import { forwardRef } from "react"
import { serverOnly$ } from "vite-env-only"
import {
    ListItem,
    ListItemAvatar,
    ListItemContent,
    ListItemContentTitle,
    ListItemTrailingSupportingText
} from "~/components/List"
import type { FragmentType } from "~/lib/graphql"
import { graphql, readFragment } from "~/lib/graphql"
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
export const SearchItem = forwardRef<
	HTMLLIElement,
	{ media: FragmentType<typeof SearchItem_media> }
>(function SearchItem({ media, ...props }, ref) {
	const data = readFragment<typeof SearchItem_media>(media)

	return (
		<ListItem
			{...props}
			ref={ref}
			render={
				<Link
					to={route_media({ id: data.id })}
					title={data.title?.userPreferred ?? undefined}
				/>
			}
		>
			<ListItemAvatar>
				<MediaCover media={data} />
			</ListItemAvatar>

			<ListItemContent>
				<ListItemContentTitle>{data.title?.userPreferred}</ListItemContentTitle>
			</ListItemContent>

			{data.type && (
				<ListItemTrailingSupportingText>
					{data.type.toLowerCase()}
				</ListItemTrailingSupportingText>
			)}
		</ListItem>
	)
})
