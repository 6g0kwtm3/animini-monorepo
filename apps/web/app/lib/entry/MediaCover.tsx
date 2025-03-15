import type { ComponentPropsWithRef, ReactNode } from "react"

import ReactRelay from "react-relay"
import type { MediaCover_media$key } from "~/gql/MediaCover_media.graphql"
import { useCreateElement, type Options } from "../createElement"
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

export function MediaCover({
	media,
	...props
}: ComponentPropsWithRef<"img"> &
	Options & {
		media: MediaCover_media$key
	}): ReactNode {
	const data = useFragment(MediaCover_media, media)

	return useCreateElement("img", {
		src:
			data.coverImage?.extraLarge ??
			data.coverImage?.large ??
			data.coverImage?.medium ??
			"",
		loading: "lazy",
		alt: "",
		...props,
		style: {
			backgroundImage: data.coverImage?.medium
				? `url(${data.coverImage.medium})`
				: undefined,
			...props.style,
		},
		className: cover({
			className: props.className,
		}),
	})
}
