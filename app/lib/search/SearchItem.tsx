import { Link } from "@remix-run/react"
import { forwardRef } from "react"
import ReactRelay from "react-relay"

import {
	ListItem,
	ListItemAvatar,
	ListItemContent,
	ListItemContentTitle,
	ListItemTrailingSupportingText,
} from "~/components/List"

import type { SearchItem_media$key } from "~/gql/SearchItem_media.graphql"
import { MediaCover } from "../entry/MediaCover"
import { MediaTitle } from "../MediaTitle"
import { useFragment } from "../Network"
import { route_media } from "../route"
const { graphql } = ReactRelay

const SearchItem_media = graphql`
	fragment SearchItem_media on Media {
		id
		type
		...MediaCover_media
		title @required(action: LOG) {
			...MediaTitle_mediaTitle
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
				render={<Link to={route_media({ id: data.id })} />}
			>
				<ListItemAvatar>
					<MediaCover media={data} />
				</ListItemAvatar>

				<ListItemContent>
					<ListItemContentTitle>
						<MediaTitle mediaTitle={data.title} />
					</ListItemContentTitle>
				</ListItemContent>

				{data.type && (
					<ListItemTrailingSupportingText>
						{data.type.toLowerCase()}
					</ListItemTrailingSupportingText>
				)}
			</ListItem>
		)
	)
})
