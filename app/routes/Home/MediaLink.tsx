import { Await, Link } from "react-router"

import {
	createContext,
	Suspense,
	use,
	type ComponentProps,
	type ReactNode,
} from "react"
import ReactRelay from "react-relay"
import { ListItemContent, ListItemImg } from "~/components"
import type { MediaLink_media$key } from "~/gql/MediaLink_media.graphql"
import { card } from "~/lib/card"
import { M3 } from "~/lib/components"
import { MediaCover } from "~/lib/entry/MediaCover"
import { createList, ListContext } from "~/lib/list"
import { MediaTitle } from "~/lib/MediaTitle"
import { useFragment } from "~/lib/Network"
import { route_media } from "~/lib/route"
const { graphql } = ReactRelay

export const MediaLinkContext = createContext<
	Record<number, Promise<MediaLink_media$key>>
>({})

const MediaLink_media = graphql`
	fragment MediaLink_media on Media {
		id
		type
		title @required(action: LOG) {
			...MediaTitle_mediaTitle
		}
		coverImage {
			theme
		}
		...MediaCover_media
	}
`
function Media(props: { media: MediaLink_media$key }) {
	const media = useFragment(MediaLink_media, props.media)

	const list = createList()

	return (
		media && (
			<span
				className={card({
					className: `not-prose contrast-standard theme-light contrast-more:contrast-high dark:theme-dark inline-flex overflow-hidden p-0 text-start`,
				})}
				style={media.coverImage?.theme ?? undefined}
			>
				<ListContext value={list}>
					<span
						className={list.root({
							className: "p-0",
						})}
					>
						<span className={list.item()}>
							<ListItemImg>
								<MediaCover media={media} />
							</ListItemImg>
							<ListItemContent>
								<span className={list.itemTitle()}>
									<MediaTitle mediaTitle={media.title} />
								</span>
								<span className={list.itemSubtitle()}>{media.type}</span>
							</ListItemContent>
						</span>
					</span>
				</ListContext>
			</span>
		)
	)
}

export function MediaLink({
	mediaId,
	...props
}: Omit<ComponentProps<typeof Link>, "to"> & {
	mediaId: number
}): ReactNode {
	const ctx = use(MediaLinkContext)
	const data = ctx[mediaId]

	return (
		data && (
			<M3.Link to={route_media({ id: mediaId })} {...props}>
				<Suspense fallback="Loading...">
					<Await errorElement={"Error..."} resolve={data}>
						{(media) => <Media media={media} />}
					</Await>
				</Suspense>
			</M3.Link>
		)
	)
}
