import type { ReactNode } from "react"
import ReactRelay from "react-relay"
import type { routeMediaCarouselItem_media$key } from "~/gql/routeMediaCarouselItem_media.graphql"
import type { routeNavIndexQuery } from "~/gql/routeNavIndexQuery.graphql"
import { Ariakit } from "~/lib/ariakit"
import { client_operation } from "~/lib/client"
import { M3 } from "~/lib/components"
import { MediaCover } from "~/lib/entry/MediaCover"
import { MediaTitle } from "~/lib/MediaTitle"
import { useFragment } from "~/lib/Network"
import MaterialSymbolsArrowForward from "~icons/material-symbols/arrow-forward"
import type Route from "./+types.route"

const { graphql } = ReactRelay

const routeMediaCarouselItem_media = graphql`
	fragment routeMediaCarouselItem_media on Media {
		id
		title @required(action: LOG) {
			...MediaTitle_mediaTitle
		}
		...MediaCover_media @arguments(extraLarge: true)
	}
`

function MediaCarouselItem(props: { media: routeMediaCarouselItem_media$key }) {
	const media = useFragment(routeMediaCarouselItem_media, props.media)

	return (
		media && (
			<M3.CarouselItem className="relative max-w-52">
				<MediaCover media={media} className="h-full rounded" />
				<div className="absolute inset-0 bg-gradient-to-b from-transparent to-scrim/60" />

				<div className="absolute bottom-0 text-balance p-3 text-title-md">
					<MediaTitle mediaTitle={media.title} />
				</div>
			</M3.CarouselItem>
		)
	)
}

export const clientLoader = async () => {
	const data = await client_operation<routeNavIndexQuery>(
		graphql`
			query routeNavIndexQuery @raw_response_type {
				Page {
					media {
						id
						...routeMediaCarouselItem_media
					}
				}
			}
		`,
		{}
	)

	return data
}

export default function NavIndexRoute({
	loaderData: data,
}: Route.ComponentProps): ReactNode {
	return (
		<M3.LayoutBody>
			<M3.LayoutPane>
				<article>
					<Ariakit.Heading>
						Fall 2024 Anime{" "}
						<MaterialSymbolsArrowForward className="i-inline inline" />
					</Ariakit.Heading>
					<M3.Carousel>
						{data?.Page?.media?.map(
							(media) =>
								media && (
									<MediaCarouselItem
										media={media}
										key={media.id}
										data-id={media.id}
									/>
								)
						)}
					</M3.Carousel>
				</article>
				<article>
					<Ariakit.Heading>
						Latest episode{" "}
						<MaterialSymbolsArrowForward className="i-inline inline" />
					</Ariakit.Heading>
					<M3.Carousel>
						{data?.Page?.media?.map(
							(media) =>
								media && (
									<MediaCarouselItem
										media={media}
										key={media.id}
										data-id={media.id}
									/>
								)
						)}
					</M3.Carousel>
				</article>
				<article>
					<Ariakit.Heading>Recent Reviews</Ariakit.Heading>
					<ul />
				</article>
			</M3.LayoutPane>
			{/* <M3.LayoutPane variant="fixed">
				<Ariakit.Heading>Top Airing Anime</Ariakit.Heading>
				<ul />
			</M3.LayoutPane> */}
		</M3.LayoutBody>
	)
}
