import type { ComponentPropsWithoutRef, ReactNode } from "react"

import ReactRelay from "react-relay"
import type { MediaTitle_mediaTitle$key } from "~/gql/MediaTitle_mediaTitle.graphql"
import { useFragment } from "./Network"
const { graphql } = ReactRelay

const MediaTitle_mediaTitle = graphql`
	fragment MediaTitle_mediaTitle on MediaTitle {
		userPreferred @required(action: LOG)
	}
`

interface Props extends ComponentPropsWithoutRef<"span"> {
	mediaTitle: MediaTitle_mediaTitle$key
}

export function MediaTitle({ mediaTitle: title, ...props }: Props): ReactNode {
	const data = useFragment(MediaTitle_mediaTitle, title)

	return (
		data && (
			<span {...props} title={data.userPreferred}>
				{data.userPreferred}
			</span>
		)
	)
}
