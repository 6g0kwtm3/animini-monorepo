import ReactRelay from "react-relay"
import {
	ListItem,
	ListItemContent,
	ListItemContentSubtitle,
	ListItemContentTitle,
	ListItemImg,
	ListItemTrailingSupportingText,
} from "~/components/List"

import { MediaCover } from "~/lib/entry/MediaCover"
import { m } from "~/lib/paraglide"
import { route_media } from "~/lib/route"

import { A } from "a"
import type { Airing_notification$key } from "~/gql/Airing_notification.graphql"
import type { Airing_viewer$key } from "~/gql/Airing_viewer.graphql"
import { useFragment } from "~/lib/Network"
import { getLocale } from "~/paraglide/runtime"
import MaterialSymbolsWarningOutline from "~icons/material-symbols/warning-outline"

const { graphql } = ReactRelay

export function Airing(props: {
	notification: Airing_notification$key
	viewer: Airing_viewer$key
}) {
	const notification = useFragment(
		graphql`
			fragment Airing_notification on AiringNotification {
				id
				episode
				createdAt
				media @required(action: LOG) {
					title @required(action: LOG) {
						userPreferred @required(action: LOG)
					}
					...MediaCover_media
					id
				}
			}
		`,
		props.notification
	)

	const viewer = useFragment(
		graphql`
			fragment Airing_viewer on User {
				id
				unreadNotificationCount
			}
		`,
		props.viewer
	)

	return (
		notification && (
			<li className="col-span-full grid grid-cols-subgrid">
				<ListItem
					render={<A href={route_media({ id: notification.media.id })}></A>}
				>
					<ListItemImg>
						<MediaCover media={notification.media} />
					</ListItemImg>
					<ListItemContent>
						<ListItemContentTitle>
							{(notification.createdAt ?? 0)
								> (viewer.unreadNotificationCount ?? 0) && (
								<MaterialSymbolsWarningOutline className="i-inline text-tertiary inline" />
							)}{" "}
							{m.episode_aired({ episode: notification.episode })}
						</ListItemContentTitle>
						<ListItemContentSubtitle
							title={notification.media.title.userPreferred}
						>
							{notification.media.title.userPreferred}
						</ListItemContentSubtitle>
					</ListItemContent>
					{notification.createdAt && (
						<ListItemTrailingSupportingText>
							{format(notification.createdAt - Date.now() / 1000)}
						</ListItemTrailingSupportingText>
					)}
				</ListItem>
			</li>
		)
	)
}

function format(seconds: number) {
	const rtf = new Intl.RelativeTimeFormat(getLocale(), {})

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
