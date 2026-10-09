import {
	ListItem,
	ListItemContent,
	ListItemContentSubtitle,
	ListItemContentTitle,
	ListItemImg,
	ListItemTrailingSupportingText,
} from "@animedes/components/List"
import "temporal-polyfill-lite/global"
import { A } from "@anitrove/a"
import ReactRelay from "react-relay"
import { MediaCover } from "~/lib/entry/MediaCover"
import { useFragment } from "~/lib/Network"
import { m } from "~/lib/paraglide"
import { route_media } from "~/lib/route"
import MaterialSymbolsWarningOutline from "~icons/material-symbols/warning-outline"

import { RelativeTimeSince } from "./RelativeTimeSince"

import type { ComponentProps } from "react"
import type { RelatedMediaAddition_notification$key } from "~/gql/RelatedMediaAddition_notification.graphql"
import type { RelatedMediaAddition_viewer$key } from "~/gql/RelatedMediaAddition_viewer.graphql"

const { graphql } = ReactRelay

interface RelatedMediaAdditionProps extends ComponentProps<typeof ListItem> {
	notification: RelatedMediaAddition_notification$key
	viewer: RelatedMediaAddition_viewer$key
}

export function RelatedMediaAddition({
	notification: notificationKey,
	viewer: viewerKey,
	...props
}: RelatedMediaAdditionProps) {
	const notification = useFragment(
		graphql`
			fragment RelatedMediaAddition_notification on RelatedMediaAdditionNotification
			@throwOnFieldError {
				id
				createdAt
				media @required(action: LOG) {
					title @required(action: LOG) {
						userPreferred @required(action: LOG)
					}
					...MediaCover_media @alias
					id
				}
			}
		`,
		notificationKey
	)

	const viewer = useFragment(
		graphql`
			fragment RelatedMediaAddition_viewer on User @throwOnFieldError {
				id
				unreadNotificationCount
			}
		`,
		viewerKey
	)

	return (
		notification && (
			<ListItem
				render={
					<A href={route_media({ id: Number(notification.media.id) })}></A>
				}
				{...props}
			>
				<ListItemImg>
					<MediaCover media={notification.media.MediaCover_media} />
				</ListItemImg>
				<ListItemContent>
					<ListItemContentTitle>
						{(notification.createdAt ?? 0)
							> (viewer.unreadNotificationCount ?? 0) && (
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
				{notification.createdAt ? (
					<ListItemTrailingSupportingText>
						<RelativeTimeSince
							date={Temporal.Instant.fromEpochMilliseconds(
								notification.createdAt * 1000
							)}
						/>
					</ListItemTrailingSupportingText>
				) : null}
			</ListItem>
		)
	)
}
