import type { ComponentProps, ReactNode } from "react"

import ReactRelay from "react-relay"
import type { MediaCover_media$key } from "~/gql/MediaCover_media.graphql"
import { useFragment } from "../Network"
import { tv } from "../tailwind-variants"

const { graphql } = ReactRelay

const MediaCover_media = graphql`
	fragment MediaCover_media on Media
	@argumentDefinitions(
		large: { type: "Boolean", defaultValue: true }
		extraLarge: { type: "Boolean", defaultValue: true }
	) {
		id
		coverImage {
			medium
			src(extraLarge: $extraLarge, large: $large) @required(action: LOG)
			srcset(extraLarge: $extraLarge, large: $large) @required(action: LOG)
		}
	}
`

const cover = tv({
	base: "bg-cover bg-center object-cover object-center",
})

export function MediaCover({
	media,
	...props
}: ComponentProps<"img"> & {
	media: MediaCover_media$key
}): ReactNode {
	const data = useFragment(MediaCover_media, media)

	if (!data.coverImage) {
		return null
	}

	return (
		<img
			loading="lazy"
			alt=""
			width={100}
			height={150}
			src={data.coverImage.src}
			srcSet={data.coverImage.srcset}
			{...props}
			style={{
				...props.style,
				backgroundImage: `url(${data.coverImage.medium})`,
			}}
			className={cover({
				className: props.className,
			})}
		/>
	)
}
