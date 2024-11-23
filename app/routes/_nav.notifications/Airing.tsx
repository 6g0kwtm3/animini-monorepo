import ReactRelay from "react-relay"
import { Link, useLoaderData } from "react-router"
import {
    ListItemContent,
    ListItemContentSubtitle,
    ListItemContentTitle,
    ListItemImg,
    ListItemTrailingSupportingText,
} from "~/components/List"

import { MediaCover } from "~/lib/entry/MediaCover"
import { m } from "~/lib/paraglide"
import { route_media } from "~/lib/route"

import { use, type ReactNode } from "react"
import type { Airing_notification$key } from "~/gql/Airing_notification.graphql"
import { ListContext } from "~/lib/list"
import { MediaTitle } from "~/lib/MediaTitle"
import { useFragment } from "~/lib/Network"
import { sourceLanguageTag } from "~/paraglide/runtime"
import MaterialSymbolsWarningOutline from "~icons/material-symbols/warning-outline"
import type { Route } from "./+types/route"

const { graphql } = ReactRelay

export function Airing(props: {
	notification: Airing_notification$key
}): ReactNode {
	const notification = useFragment(
		graphql`
			fragment Airing_notification on AiringNotification {
				id
				episode
				createdAt
				media @required(action: LOG) {
					title @required(action: LOG) {
						...MediaTitle_mediaTitle
					}
					...MediaCover_media
					id
				}
			}
		`,
		props.notification
	)
	const data = useLoaderData() as Route.ComponentProps['loaderData']

	const list = use(ListContext)

	return (
		notification && (
			<li className="col-span-full grid grid-cols-subgrid">
				<Link
					to={route_media({
						id: notification.media.id,
					})}
					className={list.item()}
				>
					<ListItemImg>
						<MediaCover media={notification.media} />
					</ListItemImg>
					<ListItemContent>
						<ListItemContentTitle>
							{(notification.createdAt ?? 0) >
								(data?.Viewer?.unreadNotificationCount ?? 0) && (
								<MaterialSymbolsWarningOutline className="i-inline inline text-tertiary" />
							)}{" "}
							{m.episode_aired({
								episode: notification.episode,
							})}
						</ListItemContentTitle>
						<ListItemContentSubtitle>
							<MediaTitle mediaTitle={notification.media.title} />
						</ListItemContentSubtitle>
					</ListItemContent>
					{notification.createdAt && (
						<ListItemTrailingSupportingText>
							{format(notification.createdAt - Date.now() / 1000)}
						</ListItemTrailingSupportingText>
					)}
				</Link>
			</li>
		)
	)
}

function format(seconds: number) {
	const rtf = new Intl.RelativeTimeFormat(sourceLanguageTag, {})

	if (Math.abs(seconds) < 60) {
		return rtf.format(Math.trunc(seconds), "seconds")
	}

	if (Math.abs(seconds) < 60 * 60) {
		return rtf.format(Math.trunc(seconds / 60), "minutes")
	}

	if (Math.abs(seconds) < 60 * 60 * 24) {
		return rtf.format(Math.trunc(seconds / (60 * 60)), "hours")
	}

	if (Math.abs(seconds) < 60 * 60 * 24 * 7) {
		return rtf.format(Math.trunc(seconds / (60 * 60 * 24)), "days")
	}

	if (Math.abs(seconds) < 60 * 60 * 24 * 365) {
		return rtf.format(Math.trunc(seconds / (60 * 60 * 24 * 7)), "weeks")
	}

	return rtf.format(Math.trunc(seconds / (60 * 60 * 24 * 365)), "years")
}
