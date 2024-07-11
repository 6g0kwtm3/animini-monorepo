import { Await, Link } from "@remix-run/react"

import {
    createContext,
    Suspense,
    useContext,
    type ComponentPropsWithRef,
    type ReactNode,
} from "react"
import { ListItemContent, ListItemImg } from "~/components"
import { route_media } from "~/lib/route"

import ReactRelay from "react-relay"
import type { MediaLink_media$key } from "~/gql/MediaLink_media.graphql"
import { card } from "~/lib/card"
import { MediaCover } from "~/lib/entry/MediaCover"
import { createList, ListContext } from "~/lib/list"
import { MediaTitle } from "~/lib/MediaTitle"
import { useFragment } from "~/lib/Network"
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
					className: `not-prose inline-flex overflow-hidden text-start contrast-standard theme-light p-0 contrast-more:contrast-high dark:theme-dark`,
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
}: Omit<ComponentPropsWithRef<typeof Link>, "to"> & {
	mediaId: number
}): ReactNode {
	const ctx = useContext(MediaLinkContext)
	const data = ctx[mediaId]

	return (
		data && (
			<Link to={route_media({ id: mediaId })} {...props}>
				<Suspense fallback="Loading...">
					<Await errorElement={"Error..."} resolve={data}>
						{(media) => <Media media={media} />}
					</Await>
				</Suspense>
			</Link>
		)
	)
}
