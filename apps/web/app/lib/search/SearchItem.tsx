import ReactRelay from "react-relay"

import {
	ListItem,
	ListItemAvatar,
	ListItemContent,
	ListItemContentTitle,
	ListItemTrailingSupportingText,
} from "~/components/List"

import { A } from "@anitrove/a"
import type { SearchItem_media$key } from "~/gql/SearchItem_media.graphql"
import { MediaCover } from "../entry/MediaCover"
import { useFragment } from "../Network"
import { route_media } from "../route"
import type { ComponentProps } from "react"
import { usePrefetch } from "@anitrove/a/prefetch"
const { graphql } = ReactRelay

interface SearchItemProps extends ComponentProps<typeof ListItem> {
	media: SearchItem_media$key
}

export function SearchItem({ media, ...props }: SearchItemProps) {
	const data = useFragment(
		graphql`
			fragment SearchItem_media on Media @throwOnFieldError {
				id
				type
				...MediaCover_media @alias
				title {
					userPreferred @required(action: LOG)
				}
			}
		`,
		media
	)

	const prefetch = usePrefetch(
		`/:locale?/media/:mediaId`,
		{ mediaId: data.id },
		(args) => {
			import("~/routes/Media/route").then(({ clientLoader }) =>
				clientLoader(args)
			)
		}
	)

	return (
		data.title != null && (
			<ListItem
				{...props}
				onFocus={prefetch}
				render={
					<A
						href={route_media({ id: Number(data.id) })}
						title={data.title.userPreferred}
						onMouseEnter={prefetch}
						onFocus={prefetch}
					/>
				}
			>
				<ListItemAvatar>
					<MediaCover media={data.MediaCover_media} />
				</ListItemAvatar>

				<ListItemContent>
					<ListItemContentTitle>
						{data.title.userPreferred}
					</ListItemContentTitle>
				</ListItemContent>

				{data.type ? (
					<ListItemTrailingSupportingText>
						{data.type.toLowerCase()}
					</ListItemTrailingSupportingText>
				) : null}
			</ListItem>
		)
	)
}
