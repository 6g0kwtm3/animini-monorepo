import type { ReactNode } from "react"

import ReactRelay from "react-relay"
import type { MediaCover_media$key } from "~/gql/MediaCover_media.graphql"
import { useFragment } from "../Network"

const { graphql } = ReactRelay

const MediaCover_media = graphql`
	fragment MediaCover_media on Media
	@argumentDefinitions(extraLarge: { type: "Boolean", defaultValue: false }) {
		id
		coverImage {
			extraLarge @include(if: $extraLarge)
			large
			medium
		}
	}
`

import { tv } from "~/lib/tailwind-variants"

const cover = tv({
	base: "in-[.transitioning]:[view-transition-name:media-cover] bg-cover bg-center object-cover object-center",
})

import * as Ariakit from "@ariakit/react"

interface MediaCoverProps extends Ariakit.RoleProps<"img"> {
	media: MediaCover_media$key
}

export function MediaCover({ media, ...props }: MediaCoverProps): ReactNode {
	const data = useFragment(MediaCover_media, media)

	return (
		<Ariakit.Role.img
			src={
				data.coverImage?.extraLarge
				?? data.coverImage?.large
				?? data.coverImage?.medium
				?? ""
			}
			loading="lazy"
			alt=""
			{...props}
			style={{
				backgroundImage: data.coverImage?.medium
					? `url(${data.coverImage.medium})`
					: undefined,
				...props.style,
			}}
			className={cover({ className: props.className })}
		></Ariakit.Role.img>
	)
}
