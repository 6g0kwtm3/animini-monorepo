import {
	ListItem,
	ListItemContent,
	ListItemContentSubtitle,
	ListItemContentTitle,
	ListItemImg,
	ListItemTrailingSupportingText,
} from "@animedes/components/List"
import "temporal-polyfill-lite/global"
import { numberToString } from "@animedes/components/numberToString"
import { A } from "@anitrove/a"
import { precompileStyles } from "@anitrove/unstyled"
import ReactRelay from "react-relay"
import { useFragment } from "~/lib/Network"
import MaterialSymbolsWarningOutline from "~icons/material-symbols/warning-outline"

import { RelativeTimeSince } from "./RelativeTimeSince"

import type { ActivityLike_notification$key } from "~/gql/ActivityLike_notification.graphql"
import type { ActivityLike_viewer$key } from "~/gql/ActivityLike_viewer.graphql"
const { graphql } = ReactRelay

interface ActivityLikeProps extends React.ComponentProps<typeof ListItem> {
	notification: ActivityLike_notification$key
	viewer: ActivityLike_viewer$key
}

export function ActivityLike({
	notification: notificationKey,
	viewer: viewerKey,
	...props
}: ActivityLikeProps) {
	const notification = useFragment(
		graphql`
			fragment ActivityLike_notification on ActivityLikeNotification
			@throwOnFieldError {
				id
				createdAt
				activityId
				context
				user {
					name
					avatar {
						large
						medium
					}
				}
			}
		`,
		notificationKey
	)

	const viewer = useFragment(
		graphql`
			fragment ActivityLike_viewer on User @throwOnFieldError {
				unreadNotificationCount
			}
		`,
		viewerKey
	)

	return (
		notification.user && (
			<ListItem
				render={
					<A href={`/activity/${numberToString(notification.activityId)}`}></A>
				}
				{...props}
			>
				<ListItemImg>
					{notification.user.avatar?.large ? (
						<img
							src={notification.user.avatar.large}
							className="h-14 w-14 bg-(image:--bg) bg-cover object-cover"
							style={
								notification.user.avatar.medium
									? { "--bg": `url(${notification.user.avatar.medium})` }
									: undefined
							}
							loading="lazy"
							alt=""
						/>
					) : null}
				</ListItemImg>
				<ListItemContent
					style={precompileStyles({
						display: "grid",
						gridTemplateColumns: "subgrid",
					})}
				>
					<ListItemContentTitle>
						{(notification.createdAt ?? 0)
							> (viewer.unreadNotificationCount ?? 0) && (
							<MaterialSymbolsWarningOutline className="i-inline text-tertiary inline" />
						)}{" "}
						{notification.context}
					</ListItemContentTitle>
					<ListItemContentSubtitle title={notification.user.name}>
						{notification.user.name}
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
