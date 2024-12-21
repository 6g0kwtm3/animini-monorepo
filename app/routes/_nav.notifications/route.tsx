import ReactRelay from "react-relay"

import { useTooltipStore } from "@ariakit/react"
import type { ActionFunction, MetaFunction } from "react-router"
import { Form, redirect } from "react-router"
import { Card } from "~/components/Card"
import { LayoutBody, LayoutPane } from "~/components/Layout"
import { List } from "~/components/List"
import {
	TooltipPlain,
	TooltipPlainContainer,
	TooltipPlainTrigger,
} from "~/components/Tooltip"

import { fab } from "~/lib/button"

import type { ReactNode } from "react"
import type { routeNavNotificationsQuery as NavNotificationsQuery } from "~/gql/routeNavNotificationsQuery.graphql"
import type { routeNavNotifications_query$key } from "~/gql/routeNavNotifications_query.graphql"
import { commitLocalUpdate, fetchQuery, useFragment } from "~/lib/Network"
import { Ariakit } from "~/lib/ariakit"
import MaterialSymbolsDone from "~icons/material-symbols/done"
import { ActivityLike } from "./ActivityLike"
import { Airing } from "./Airing"
import { RelatedMediaAddition } from "./RelatedMediaAddition"

import type { routeNavNotificationsUpdateQuery } from "~/gql/routeNavNotificationsUpdateQuery.graphql"
import type { Route } from "./+types/route"

const { graphql } = ReactRelay

export const clientLoader = async () => {
	const data = await fetchQuery<NavNotificationsQuery>(
		graphql`
			query routeNavNotificationsQuery @raw_response_type {
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
	await fetchQuery(
		graphql`
			query routeNavNotificationsReadQuery @raw_response_type {
				Page(perPage: 0) {
					notifications(resetNotificationCount: true) {
						__typename
					}
				}
			}
		`,
		{}
	)

	commitLocalUpdate((store) => {
		const { updatableData } =
			store.readUpdatableQuery<routeNavNotificationsUpdateQuery>(
				graphql`
					query routeNavNotificationsUpdateQuery @updatable {
						Viewer {
							unreadNotificationCount
						}
					}
				`,
				{}
			)

		if (updatableData.Viewer) {
			updatableData.Viewer.unreadNotificationCount = 0
		}
	})

	return redirect(".")
}) satisfies ActionFunction

export default function Notifications({
	loaderData: data,
}: Route.ComponentProps): ReactNode {
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
				{someNotRead > 0 && (
					<Form method="post">
						<div className="fixed end-4 bottom-24 sm:bottom-4">
							<div className="relative">
								<TooltipPlain store={store}>
									<TooltipPlainTrigger
										render={
											<button type="submit" className={fab({ className: "" })}>
												<MaterialSymbolsDone />
											</button>
										}
									/>
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
						<List lines={{ initial: "three", sm: "two" }}>
							{query?.Page?.notifications
								?.filter((el) => el != null)
								.map((notification) => {
									if (notification.__typename === "AiringNotification") {
										return (
											<Airing
												data-id={notification.id}
												key={notification.id}
												notification={notification}
											/>
										)
									}
									if (
										notification.__typename ===
										"RelatedMediaAdditionNotification"
									) {
										return (
											<RelatedMediaAddition
												data-id={notification.id}
												key={notification.id}
												notification={notification}
											/>
										)
									}
									if (notification.__typename === "ActivityLikeNotification") {
										return (
											<ActivityLike
												data-id={notification.id}
												key={notification.id}
												notification={notification}
											/>
										)
									}

									notification.__typename satisfies "%other"

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
	return [
		{
			title: `Notifications`,
		},
	]
}) satisfies MetaFunction<typeof clientLoader>
