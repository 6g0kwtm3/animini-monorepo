import { forwardRef } from "react"
import ReactRelay from "react-relay"
import { Link } from "react-router"

import {
    ListItem,
    ListItemAvatar,
    ListItemContent,
    ListItemContentTitle,
    ListItemTrailingSupportingText,
} from "~/components/List"

import type { SearchItem_media$key } from "~/gql/SearchItem_media.graphql"
import { MediaCover } from "../entry/MediaCover"
import { useFragment } from "../Network"
import { route_media } from "../route"
const { graphql } = ReactRelay

const SearchItem_media = graphql`
	fragment SearchItem_media on Media {
		id
		type
		...MediaCover_media
		title @required(action: LOG) {
			userPreferred @required(action: LOG)
		}
	}
`

export const SearchItem = forwardRef<
	HTMLLIElement,
	{ media: SearchItem_media$key }
>(function SearchItem({ media, ...props }, ref) {
	const data = useFragment(SearchItem_media, media)

	return (
		data && (
			<ListItem
				{...props}
				ref={ref}
				render={
					<Link
						to={route_media({ id: data?.id })}
						title={data?.title.userPreferred}
					/>
				}
			>
				<ListItemAvatar>
					<MediaCover media={data} />
				</ListItemAvatar>

				<ListItemContent>
					<ListItemContentTitle>
						{data?.title.userPreferred}
					</ListItemContentTitle>
				</ListItemContent>

				{data?.type && (
					<ListItemTrailingSupportingText>
						{data?.type.toLowerCase()}
					</ListItemTrailingSupportingText>
				)}
			</ListItem>
		)
	)
})
