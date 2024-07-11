import type { ComponentProps, ReactNode } from "react"
import { createTV } from "tailwind-variants"

import ReactRelay from "react-relay"
import type { MediaCover_media$key } from "~/gql/MediaCover_media.graphql"
import { useFragment } from "../Network"

const { graphql } = ReactRelay

const MediaCover_media = graphql`
	fragment MediaCover_media on Media
	@argumentDefinitions(
		large: { type: "Boolean", defaultValue: true }
		extraLarge: { type: "Boolean", defaultValue: true }
	) {
		id
		coverImage {
			extraLarge @include(if: $extraLarge)
			large @include(if: $large)
			medium
		}
	}
`

export type MediaCover_media = typeof MediaCover_media

const tv = createTV({ twMerge: false })

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

	const src =
		data.coverImage.extraLarge ??
		data.coverImage.large ??
		data.coverImage.medium

	const srcSet = toSrcSet([
		[1, data.coverImage.medium],
		[2.3, data.coverImage.large],
		[4.6, data.coverImage.extraLarge],
	])

	return (
		src && (
			<img
				loading="lazy"
				alt=""
				width={100}
				height={150}
				src={src}
				srcSet={srcSet}
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
	)
}

function toSrcSet(entries: [number, string | undefined | null][]): string {
	const filtered = entries.flatMap(([scale, src]): [number, string][] =>
		src ? [[scale, src]] : []
	)

	for (const entry of filtered) {
		entry[0] /= filtered[0]![0]
	}

	const normalized = filtered.map(([scale, src]) => [` ${scale}x`, src])

	if (normalized[0]) normalized[0][0] = ""

	return normalized.map(([scale, src]) => `${src}${scale}`).join(", ")
}
