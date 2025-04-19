import ReactRelay from "react-relay"

import { useTooltipStore } from "@ariakit/react"
import type {
	ActionFunction,
	ClientLoaderFunctionArgs,
	MetaFunction,
} from "react-router"
import { Form, redirect, useLoaderData } from "react-router"
import { Card } from "~/components/Card"
import { LayoutBody, LayoutPane } from "~/components/Layout"
import { List } from "~/components/List"
import {
	TooltipPlain,
	TooltipPlainContainer,
	TooltipPlainTrigger,
} from "~/components/Tooltip"

import { fab } from "~/lib/button"

import * as Ariakit from "@ariakit/react"
import type { ReactNode } from "react"
import type { routeNavNotificationsQuery as NavNotificationsQuery } from "~/gql/routeNavNotificationsQuery.graphql"
import type { routeNavNotifications_query$key } from "~/gql/routeNavNotifications_query.graphql"
import { useFragment } from "~/lib/Network"
import { client_get_client } from "~/lib/client"
import MaterialSymbolsDone from "~icons/material-symbols/done"
import { ActivityLike } from "./ActivityLike"
import { Airing } from "./Airing"
import { RelatedMediaAddition } from "./RelatedMediaAddition"

const { graphql } = ReactRelay

export const clientLoader = async (_: ClientLoaderFunctionArgs) => {
	const client = client_get_client()

	const data = await client.query<NavNotificationsQuery>(
		graphql`
			query routeNavNotificationsQuery {
				Viewer {
					id
					unreadNotificationCount
				}
				...routeNavNotifications_query
			}
		`,
		{}
	)

	return data
}

export const clientAction = (async () => {
	const client = client_get_client()

	await client.query(
		graphql`
			query routeNavNotificationsReadQuery {
				Page(perPage: 0) {
					notifications(resetNotificationCount: true) {
						__typename
					}
				}
			}
		`,
		{}
	)

	return redirect(".")
}) satisfies ActionFunction

export default function Notifications(): ReactNode {
	const data = useLoaderData<typeof clientLoader>()

	const key: routeNavNotifications_query$key | undefined = data

	const query = useFragment(
		graphql`
			fragment routeNavNotifications_query on Query {
				Page {
					notifications(
						type_in: [AIRING, RELATED_MEDIA_ADDITION, ACTIVITY_LIKE]
					) {
						__typename
						... on AiringNotification {
							id
							...Airing_notification
						}
						... on RelatedMediaAdditionNotification {
							id
							...RelatedMediaAddition_notification
						}
						... on ActivityLikeNotification {
							id
							...ActivityLike_notification
						}
					}
				}
			}
		`,
		key
	)

	const store = useTooltipStore()

	const someNotRead = data?.Viewer?.unreadNotificationCount ?? 0

	return (
		<LayoutBody>
			<LayoutPane>
				{someNotRead && (
					<Form method="post">
						<div className="fixed bottom-24 end-4 sm:bottom-4">
							<div className="relative">
								<TooltipPlain store={store}>
									<TooltipPlainTrigger
										render={
											<button
												type="submit"
												className={fab({ className: "" })}
											></button>
										}
									>
										<MaterialSymbolsDone />
									</TooltipPlainTrigger>
									<TooltipPlainContainer>
										Mark all as read
									</TooltipPlainContainer>
								</TooltipPlain>
							</div>
						</div>
					</Form>
				)}
				<Card variant="elevated" className="max-sm:contents">
					{!query?.Page?.notifications?.length && (
						<Ariakit.Heading>No Notifications</Ariakit.Heading>
					)}

					<div className="-mx-4 sm:-my-4">
						<List className="list-three sm:list-two">
							{query?.Page?.notifications
								?.filter((el) => el != null)
								.map((notification) => {
									if (notification.__typename === "AiringNotification") {
										return (
											<Airing
												key={notification.id}
												data-key={notification.id}
												notification={notification}
											/>
										)
									}
									if (
										notification.__typename
										=== "RelatedMediaAdditionNotification"
									) {
										return (
											<RelatedMediaAddition
												key={notification.id}
												data-key={notification.id}
												notification={notification}
											/>
										)
									}
									if (notification.__typename === "ActivityLikeNotification") {
										return (
											<ActivityLike
												key={notification.id}
												data-key={notification.id}
												notification={notification}
											/>
										)
									}
									return null
								})}
						</List>
					</div>
				</Card>
			</LayoutPane>
		</LayoutBody>
	)
}

export const meta = (() => {
	return [{ title: `Notifications` }]
}) satisfies MetaFunction<typeof clientLoader>
