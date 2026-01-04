import { ErrorBoundary } from "@sentry/react"
import type { ComponentProps } from "react"
import { Suspense } from "react"
import ReactRelay, { useLazyLoadQuery } from "react-relay"
import { Card } from "~/components/Card"
import {
	List,
	ListItem,
	ListItemContent,
	ListItemImg,
	ListItemContentSubtitle as ListItemSubtitle,
	ListItemContentTitle as ListItemTitle,
} from "~/components/List"

import { route_media } from "~/lib/route"

// console.log(R)

import { MediaCover } from "~/lib/entry/MediaCover"

import { A } from "@anitrove/a"
import { mergeStyles, precompileStyles, useStyles } from "@anitrove/unstyled"
import type { MediaLinkCardQuery } from "~/gql/MediaLinkCardQuery.graphql"
const { graphql } = ReactRelay

interface MediaLinkProps extends Omit<ComponentProps<typeof A>, "href"> {
	mediaId: number
	type: string
	slug?: string
}

export function MediaLink({ mediaId, type, slug, ...props }: MediaLinkProps) {
	const fallback = (
		<>
			{route_media({ id: mediaId })}
			{slug ?? ""}
		</>
	)

	return (
		<A href={route_media({ id: mediaId })} {...props}>
			<ErrorBoundary fallback={fallback}>
				<Suspense fallback={fallback}>
					<MediaCard mediaId={mediaId} type={type}></MediaCard>
				</Suspense>
			</ErrorBoundary>
		</A>
	)
}

function MediaCard(props: { mediaId: number; type: string }) {
	const media = useLazyLoadQuery<MediaLinkCardQuery>(
		graphql`
			query MediaLinkCardQuery($id: Int) {
				Media(id: $id) {
					title {
						userPreferred
					}
					coverImage {
						theme
					}
					...MediaCover_media
				}
			}
		`,
		{ id: props.mediaId }
	).Media

	const [className, jsx] = useStyles(
		mergeStyles(media?.coverImage?.theme ?? undefined)
	)

	return (
		media && (
			<>
				<Card
					className={`not-prose contrast-standard theme-light contrast-more:contrast-high dark:theme-dark inline-flex overflow-hidden p-0 text-start ${className}`}
					render={<span />}
				>
					<List style={precompileStyles({ padding: "0" })} render={<span />}>
						<ListItem render={<span />}>
							<ListItemImg render={<span></span>}>
								<MediaCover media={media} />
							</ListItemImg>
							<ListItemContent render={<span></span>}>
								<ListItemTitle render={<span />}>
									{media.title?.userPreferred}
								</ListItemTitle>
								<ListItemSubtitle render={<span />}>
									{props.type}
								</ListItemSubtitle>
							</ListItemContent>
						</ListItem>
					</List>
				</Card>
				{jsx}
			</>
		)
	)
}
