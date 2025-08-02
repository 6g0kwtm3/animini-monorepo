import ReactRelay from "react-relay"

import {
	ListItem,
	ListItemAvatar,
	ListItemContent,
	ListItemContentTitle,
	ListItemTrailingSupportingText,
} from "~/components/List"

import { A } from "a"
import type { SearchItem_media$key } from "~/gql/SearchItem_media.graphql"
import { MediaCover } from "../entry/MediaCover"
import { useFragment } from "../Network"
import { route_media } from "../route"
const { graphql } = ReactRelay

export function SearchItem({
	media,
	...props
}: {
	media: SearchItem_media$key
}) {
	const data = useFragment(
		graphql`
			fragment SearchItem_media on Media {
				id
				type
				...MediaCover_media
				title @required(action: LOG) {
					userPreferred @required(action: LOG)
				}
			}
		`,
		media
	)

	return (
		data && (
			<ListItem
				{...props}
				render={
					<A
						href={route_media({ id: data.id })}
						title={data.title.userPreferred}
					/>
				}
			>
				<ListItemAvatar>
					<MediaCover media={data} />
				</ListItemAvatar>

				<ListItemContent>
					<ListItemContentTitle>
						{data.title.userPreferred}
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
}
