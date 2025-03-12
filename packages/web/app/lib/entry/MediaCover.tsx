import type { ComponentPropsWithoutRef, ReactNode } from "react"

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

import { tv } from "~/lib/tailwind-variants"

const cover = tv({
	base: "bg-cover bg-center object-cover object-center in-[.transitioning]:[view-transition-name:media-cover]",
})
export function MediaCover({
	media,
	...props
}: ComponentPropsWithoutRef<"img"> & {
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
