import ReactRelay from "react-relay"
import {
	ListItem,
	ListItemContent,
	ListItemContentSubtitle,
	ListItemContentTitle,
	ListItemImg,
	ListItemTrailingSupportingText,
} from "~/components"
import type { ActivityLike_notification$key } from "~/gql/ActivityLike_notification.graphql"
import { useRawLoaderData } from "~/lib/data"
import { useFragment } from "~/lib/Network"
import { numberToString } from "~/lib/numberToString"
import { getLocale } from "~/paraglide/runtime"
import MaterialSymbolsWarningOutline from "~icons/material-symbols/warning-outline"
import type { clientLoader } from "./route"
import { A } from "a"
const { graphql } = ReactRelay

export function ActivityLike(props: {
	notification: ActivityLike_notification$key
}) {
	const notification = useFragment(
		graphql`
			fragment ActivityLike_notification on ActivityLikeNotification {
				id
				createdAt
				activityId
				context
				user {
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
	const data = useRawLoaderData<typeof clientLoader>()

	return (
		notification.user && (
			<ListItem
				render={
					<A href={`/activity/${numberToString(notification.activityId)}`} />
				}
			>
				<ListItemImg>
					{notification.user.avatar?.large && (
						<img
							src={notification.user.avatar.large}
							className="bg-(image:--bg) h-14 w-14 bg-cover object-cover"
							style={
								notification.user.avatar.medium
									? { "--bg": `url(${notification.user.avatar.medium})` }
									: undefined
							}
							loading="lazy"
							alt=""
						/>
					)}
				</ListItemImg>
				<ListItemContent className="grid grid-cols-subgrid">
					<ListItemContentTitle>
						{(notification.createdAt ?? 0)
							> (data?.Viewer?.unreadNotificationCount ?? 0) && (
							<MaterialSymbolsWarningOutline className="i-inline text-tertiary inline" />
						)}{" "}
						{notification.context}
					</ListItemContentTitle>
					<ListItemContentSubtitle title={notification.user.name}>
						{notification.user.name}
					</ListItemContentSubtitle>
				</ListItemContent>
				{notification.createdAt && (
					<ListItemTrailingSupportingText>
						{format(notification.createdAt - Date.now() / 1000)}
					</ListItemTrailingSupportingText>
				)}
			</ListItem>
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
