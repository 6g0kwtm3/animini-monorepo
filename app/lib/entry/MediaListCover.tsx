import { motion } from "framer-motion"
import type { ComponentPropsWithoutRef } from "react"
import type { FragmentType } from "../graphql"
import { graphql, useFragment } from "../graphql"
import { serverOnly$ } from "vite-env-only"

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

export function MediaCover({
	media,
	...props
}: ComponentPropsWithoutRef<typeof motion.img> & {
	media: FragmentType<typeof MediaCover_media>
}) {
	const data = useFragment<typeof MediaCover_media>(media)

	return (
		<motion.img
			src={
				data.coverImage?.extraLarge ??
				data.coverImage?.large ??
				data.coverImage?.medium ??
				""
			}
			className="bg-cover object-cover"
			style={{
				backgroundImage: `url(${data.coverImage?.medium})`
			}}
			loading="lazy"
			alt=""
			{...props}
		/>
	)
}
