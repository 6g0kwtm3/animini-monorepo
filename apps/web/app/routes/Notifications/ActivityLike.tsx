import { A } from "@anitrove/a"
import { precompileStyles } from "@anitrove/unstyled"
import { useState } from "react"
import ReactRelay from "react-relay"
import {
	ListItem,
	ListItemContent,
	ListItemContentSubtitle,
	ListItemContentTitle,
	ListItemImg,
	ListItemTrailingSupportingText,
} from "~/components/List"
import type { ActivityLike_notification$key } from "~/gql/ActivityLike_notification.graphql"
import type { ActivityLike_viewer$key } from "~/gql/ActivityLike_viewer.graphql"
import { useFragment } from "~/lib/Network"
import { numberToString } from "~/lib/numberToString"
import { getLocale } from "~/paraglide/runtime"
import MaterialSymbolsWarningOutline from "~icons/material-symbols/warning-outline"
const { graphql } = ReactRelay

export function ActivityLike(props: {
	notification: ActivityLike_notification$key
	viewer: ActivityLike_viewer$key
}) {
	const notification = useFragment(
		graphql`
			fragment ActivityLike_notification on ActivityLikeNotification {
				id
				createdAt
				activityId
				context
				user @required(action: LOG) {
					id
					name
					avatar {
						large
						medium
					}
				}
			}
		`,
		props.notification
	)

	const viewer = useFragment(
		graphql`
			fragment ActivityLike_viewer on User {
				id
				unreadNotificationCount
			}
		`,
		props.viewer
	)

	const [dateNow] = useState(() => Date.now())
	return notification != null ? (
		<ListItem
			render={
				<A href={`/activity/${numberToString(notification.activityId)}`}></A>
			}
		>
			<ListItemImg>
				{notification.user.avatar?.large != null
				&& notification.user.avatar?.large !== "" ? (
					<img
						src={notification.user.avatar.large}
						className="bg-(image:--bg) h-14 w-14 bg-cover object-cover"
						style={
							notification.user.avatar.medium != null
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
			{notification.createdAt != null ? (
				<ListItemTrailingSupportingText>
					{format(notification.createdAt - dateNow / 1000)}
				</ListItemTrailingSupportingText>
			) : null}
		</ListItem>
	) : null
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
