import { useLoaderData } from "react-router"

import { use, type ReactNode } from "react"
import ReactRelay from "react-relay"
import {
	ListItemContent,
	ListItemContentSubtitle,
	ListItemContentTitle,
	ListItemImg,
	ListItemTrailingSupportingText,
} from "~/components"
import type { ActivityLike_notification$key } from "~/gql/ActivityLike_notification.graphql"
import { ListContext } from "~/lib/list"
import { useFragment } from "~/lib/Network"
import { getLocale as useLocale } from "~/paraglide/runtime"
import MaterialSymbolsWarningOutline from "~icons/material-symbols/warning-outline"
import type { Route } from "./+types/route"
import { M3 } from "~/lib/components"
const { graphql } = ReactRelay

export function ActivityLike(props: {
	notification: ActivityLike_notification$key
}): ReactNode {
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

	const data = useLoaderData() as Route.ComponentProps["loaderData"]

	const list = use(ListContext)
	const locale = useLocale()

	return (
		notification.user && (
			<M3.Link
				to={`/activity/${notification.activityId}`}
				className={list.item()}
			>
				<ListItemImg>
					{notification.user.avatar?.large && (
						<img
							src={notification.user.avatar.large}
							className="h-14 w-14 bg-[image:--bg] bg-cover object-cover"
							style={{
								"--bg": `url(${notification.user.avatar.medium})`,
							}}
							loading="lazy"
							alt=""
						/>
					)}
				</ListItemImg>
				<ListItemContent className="grid grid-cols-subgrid">
					<ListItemContentTitle>
						{(notification.createdAt ?? 0) >
							(data.Viewer?.unreadNotificationCount ?? 0) && (
							<MaterialSymbolsWarningOutline className="i-inline inline text-tertiary" />
						)}{" "}
						{notification.context}
					</ListItemContentTitle>
					<ListItemContentSubtitle title={notification.user.name}>
						{notification.user.name}
					</ListItemContentSubtitle>
				</ListItemContent>
				{notification.createdAt && (
					<ListItemTrailingSupportingText>
						{format(notification.createdAt - Date.now() / 1000, locale)}
					</ListItemTrailingSupportingText>
				)}
			</M3.Link>
		)
	)
}

function format(seconds: number, locale: string) {
	const rtf = new Intl.RelativeTimeFormat(locale, {})

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
