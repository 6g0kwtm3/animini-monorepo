import { Link } from "@remix-run/react"
import { use, type ReactNode } from "react"
import ReactRelay from "react-relay"

import {
	ListItemAvatar,
	ListItemContent,
	ListItemContentTitle,
	ListItemTrailingSupportingText,
} from "~/components/List"

import type { SearchItem_media$key } from "~/gql/SearchItem_media.graphql"
import { MediaCover } from "../entry/MediaCover"
import { ListContext } from "../list"
import { MediaTitle } from "../MediaTitle"
import { useFragment } from "../Network"
import { route_media } from "../route"
const { graphql } = ReactRelay

const SearchItem_media = graphql`
	fragment SearchItem_media on Media {
		id
		type
		title @required(action: LOG) {
			...MediaTitle_mediaTitle
		}
		...MediaCover_media
	}
`

export function SearchItem({
	media,
	...props
}: {
	media: SearchItem_media$key
}): ReactNode {
	const data = useFragment(SearchItem_media, media)

	const list = use(ListContext)

	return (
		data && (
			<Link to={route_media({ id: data.id })} className={list.item()}>
				<>
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
				</>
			</Link>
		)
	)
}
