import { type ReactNode } from "react"
import ReactRelay from "react-relay"
import type { MetaFunction } from "react-router"
import type { routeMediaCarouselItem_media$key } from "~/gql/routeMediaCarouselItem_media.graphql"
import type { routeMediaCarouselItemBig_media$key } from "~/gql/routeMediaCarouselItemBig_media.graphql"
import type { routeNavIndexQuery } from "~/gql/routeNavIndexQuery.graphql"
import type { routeNavIndexQuery_query$key } from "~/gql/routeNavIndexQuery_query.graphql"
import { Ariakit } from "~/lib/ariakit"
import { M3 } from "~/lib/components"
import { MediaCover } from "~/lib/entry/MediaCover"
import { MediaTitle } from "~/lib/MediaTitle"
import { loadQuery, useFragment, usePreloadedQuery } from "~/lib/Network"
import MaterialSymbolsArrowForward from "~icons/material-symbols/arrow-forward"
import MaterialSymbolsInfoOutline from "~icons/material-symbols/info-outline"
import { Markdown, type Options } from "../_nav.feed/Markdown"
import type { Route } from "./+types/route"

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

export const meta = (() => [
	{
		title: "Home",
	},
]) satisfies MetaFunction

function MediaCarouselItem(props: { media: routeMediaCarouselItem_media$key }) {
	const media = useFragment(routeMediaCarouselItem_media, props.media)

	return (
		media && (
			<M3.CarouselItem className="relative max-w-52">
				<MediaCover media={media} className="h-full rounded" />
				<div className="to-scrim/60 absolute inset-0 bg-gradient-to-b from-transparent" />

				<div className="text-title-md absolute bottom-0 p-3 text-balance">
					<MediaTitle mediaTitle={media.title} />
				</div>
			</M3.CarouselItem>
		)
	)
}

export const clientLoader = async () => {
	const data = loadQuery<routeNavIndexQuery>(
		graphql`
			query routeNavIndexQuery @raw_response_type {
				...routeNavIndexQuery_query
			}
		`,
		{}
	)

	return data
}

const routeNavIndexQuery_query = graphql`
	fragment routeNavIndexQuery_query on Query {
		Page {
			media(sort: [TRENDING_DESC]) {
				id
				...routeMediaCarouselItem_media
				...routeMediaCarouselItemBig_media
				title {
					userPreferred
				}
			}
		}
	}
`

export default function NavIndexRoute({
	loaderData,
}: Route.ComponentProps): ReactNode {
	const data = useFragment<routeNavIndexQuery_query$key>(
		routeNavIndexQuery_query,
		usePreloadedQuery(...loaderData!)
	)

	return (
		<M3.LayoutBody>
			<M3.LayoutPane>
				<article className="">
					<M3.Carousel className="rounded">
						{data.Page?.media?.map(
							(media) =>
								media && (
									<MediaCarouselItemBig
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
						Fall 2024 Anime{" "}
						<MaterialSymbolsArrowForward className="i-inline inline" />
					</Ariakit.Heading>
					<M3.Carousel>
						{data.Page?.media?.map(
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
						{data.Page?.media?.map(
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

const options: Options = {
	replace: {
		br(props): ReactNode {
			return props.children
		},
	},
}
function MediaCarouselItemBig(props: {
	media: routeMediaCarouselItemBig_media$key
}) {
	const media = useFragment(
		graphql`
			fragment routeMediaCarouselItemBig_media on Media {
				id
				title @required(action: LOG) {
					...MediaTitle_mediaTitle
				}
				coverImage {
					theme
				}
				description
				bannerImage @required(action: LOG)
			}
		`,
		props.media
	)

	return (
		media && (
			<M3.CarouselItem
				className="contrast-standard theme-light contrast-more:contrast-high dark:theme-dark relative max-w-full overflow-hidden rounded"
				id={media.id}
				style={media.coverImage?.theme ?? undefined}
			>
				{/* <MediaCover media={media} className="h-full rounded" /> */}
				<div className="grid">
					<div className="col-start-1 row-start-1">
						<img
							loading="lazy"
							src={media.bannerImage}
							height={400}
							width={1900}
							alt=""
							className="h-80 object-cover object-center"
						/>
					</div>
					<div className="from-scrim col-start-1 row-start-1 bg-linear-45 to-transparent to-60%" />
					<div className="from-scrim col-start-1 row-start-1 bg-gradient-to-t to-transparent to-60%" />
					<div className="text-title-md col-start-1 row-start-1 grid grid-cols-2 items-end gap-2 p-3">
						<div className="">
							<div>
								<Ariakit.Heading className="text-display-sm line-clamp-2 text-balance">
									<MediaTitle mediaTitle={media.title} />
								</Ariakit.Heading>
								{media.description && (
									<Markdown
										className="text-body-md line-clamp-3"
										options={options}
									>
										{media.description}
									</Markdown>
								)}
							</div>
						</div>
						<div className="flex justify-end">
							<M3.Button variant="elevated">
								<M3.ButtonIcon>
									<MaterialSymbolsInfoOutline />
								</M3.ButtonIcon>
								Details
							</M3.Button>
						</div>
					</div>
				</div>
			</M3.CarouselItem>
		)
	)
}
