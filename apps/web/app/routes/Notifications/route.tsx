import ReactRelay from "react-relay"

import { useTooltipStore } from "@ariakit/react"
import type {
	ActionFunction,
	ClientLoaderFunctionArgs,
	MetaFunction,
} from "react-router"
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

import * as Ariakit from "@ariakit/react"
import type { ReactNode } from "react"
import type { routeNavNotificationsQuery as routeNavNotificationsQueryOperation } from "~/gql/routeNavNotificationsQuery.graphql"
import { loadQuery, usePreloadedQuery } from "~/lib/Network"
import { client_get_client } from "~/lib/client"
import MaterialSymbolsDone from "~icons/material-symbols/done"
import type { Route } from "./+types/route"
import { ActivityLike } from "./ActivityLike"
import { Airing } from "./Airing"
import { RelatedMediaAddition } from "./RelatedMediaAddition"

const { graphql } = ReactRelay

export const clientLoader = (args: ClientLoaderFunctionArgs) => {
	return {
		routeNavNotificationsQuery: args.context.get(
			loadQuery
		)<routeNavNotificationsQueryOperation>(routeNavNotificationsQuery, {}),
	}
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

const routeNavNotificationsQuery = graphql`
	query routeNavNotificationsQuery {
		Viewer @required(action: THROW) {
			id
			unreadNotificationCount
			...Airing_viewer
			...RelatedMediaAddition_viewer
			...ActivityLike_viewer
		}
		Page {
			notifications(type_in: [AIRING, RELATED_MEDIA_ADDITION, ACTIVITY_LIKE]) {
				... on AiringNotification {
					id
					...Airing_notification @alias
				}
				... on RelatedMediaAdditionNotification {
					id
					...RelatedMediaAddition_notification @alias
				}
				... on ActivityLikeNotification {
					id
					...ActivityLike_notification @alias
				}
			}
		}
	}
`

export default function Page({ loaderData }: Route.ComponentProps): ReactNode {
	const data = usePreloadedQuery(loaderData.routeNavNotificationsQuery)
	const store = useTooltipStore()
	const someNotRead = data.Viewer.unreadNotificationCount ?? 0

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
					{!data.Page?.notifications?.length && (
						<Ariakit.Heading>No Notifications</Ariakit.Heading>
					)}

					<div className="-mx-4 sm:-my-4">
						<List className="list-three sm:list-two">
							{data.Page?.notifications
								?.filter((el) => el != null)
								.map((notification) => {
									if (notification.Airing_notification) {
										return (
											<Airing
												key={notification.id}
												data-key={notification.id}
												notification={notification.Airing_notification}
												viewer={data.Viewer}
											/>
										)
									}
									if (notification.RelatedMediaAddition_notification) {
										return (
											<RelatedMediaAddition
												key={notification.id}
												data-key={notification.id}
												notification={
													notification.RelatedMediaAddition_notification
												}
												viewer={data.Viewer}
											/>
										)
									}
									if (notification.ActivityLike_notification) {
										return (
											<ActivityLike
												key={notification.id}
												data-key={notification.id}
												notification={notification.ActivityLike_notification}
												viewer={data.Viewer}
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
