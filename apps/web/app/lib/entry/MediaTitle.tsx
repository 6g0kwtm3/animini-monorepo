import type { ReactNode } from "react"
import { useFragment } from "react-relay"
import { graphql } from "relay-runtime"
import type { MediaTitle_media$key } from "~/gql/MediaTitle_media.graphql"

const MediaTitle_media = graphql`
	fragment MediaTitle_media on Media {
		title @required(action: LOG) {
			userPreferred @required(action: LOG)
		}
	}
`

export function MediaTitle(props: { media: MediaTitle_media$key }): ReactNode {
	const media = useFragment(MediaTitle_media, props.media)

	return media?.title.userPreferred
}
