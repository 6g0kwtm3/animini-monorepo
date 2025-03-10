import ReactRelay from "react-relay"

import { Link, useLoaderData } from "react-router"
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
import { languageTag as getLocale } from "~/paraglide/runtime"

import type { RelatedMediaAddition_notification$key } from "~/gql/RelatedMediaAddition_notification.graphql"
import { useFragment } from "~/lib/Network"
import MaterialSymbolsWarningOutline from "~icons/material-symbols/warning-outline"
import type { clientLoader } from "./route"

const { graphql } = ReactRelay

export function RelatedMediaAddition(props: {
	notification: RelatedMediaAddition_notification$key
}) {
	const notification = useFragment(
		graphql`
			fragment RelatedMediaAddition_notification on RelatedMediaAdditionNotification {
				id
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
	const data = useLoaderData<typeof clientLoader>()

	return (
		notification && (
			<li className="col-span-full grid grid-cols-subgrid">
				<ListItem
					render={
						<Link
							to={route_media({
								id: notification.media.id,
							})}
						/>
					}
				>
					<ListItemImg>
						<MediaCover media={notification.media} />
					</ListItemImg>
					<ListItemContent>
						<ListItemContentTitle>
							{(notification.createdAt ?? 0) >
								(data.Viewer?.unreadNotificationCount ?? 0) && (
								<MaterialSymbolsWarningOutline className="i-inline text-tertiary inline" />
							)}{" "}
							{m.recently_added()}
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
