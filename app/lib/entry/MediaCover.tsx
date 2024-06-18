import type { ComponentPropsWithRef, ReactNode } from "react"
import { createTV } from "tailwind-variants"

import ReactRelay from "react-relay"
import type { MediaCover_media$key } from "~/gql/MediaCover_media.graphql"
import { createElement } from "../createElement"
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

export type MediaCover_media = typeof MediaCover_media

const tv = createTV({ twMerge: false })

const cover = tv({
	base: "bg-cover bg-center object-cover object-center [.transitioning_&]:[view-transition-name:media-cover]",
})
export function MediaCover({
	media,
	...props
}: ComponentPropsWithRef<"img"> & {
	media: MediaCover_media$key
}): ReactNode {
	const data = useFragment(MediaCover_media, media)

	return createElement("img", {
		src:
			data.coverImage?.extraLarge ??
			data.coverImage?.large ??
			data.coverImage?.medium ??
			"",
		loading: "lazy",
		alt: "",
		...props,
		style: {
			backgroundImage: `url(${data.coverImage?.medium})`,
			...props.style,
		},
		className: cover({
			className: props.className,
		}),
	})
}
