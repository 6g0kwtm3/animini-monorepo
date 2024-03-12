import type { ComponentPropsWithoutRef, ReactNode } from "react"
import { createTV } from "tailwind-variants"
import { serverOnly$ } from "vite-env-only"
import { createElement } from "../createElement"
import type { FragmentType } from "../graphql"
import { graphql, useFragment } from "../graphql"

const MediaCover_media = serverOnly$(
	graphql(`
		fragment MediaCover_media on Media {
			id
			coverImage {
				extraLarge @include(if: $coverExtraLarge)
				large
				medium
			}
		}
	`)
)

export type MediaCover_media = typeof MediaCover_media

const tv = createTV({ twMerge: false })

const cover = tv({
	base: "bg-cover bg-center object-cover object-center [.transitioning_&]:[view-transition-name:media-cover]"
})
export function MediaCover({
	media,
	...props
}: ComponentPropsWithoutRef<"img"> & {
	media: FragmentType<typeof MediaCover_media>
}): ReactNode {
	const data = useFragment<typeof MediaCover_media>(media)

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
			...props.style
		},
		className: cover({
			className: props.className
		})
	})
}
