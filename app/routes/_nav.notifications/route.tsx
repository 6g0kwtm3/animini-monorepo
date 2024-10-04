import ReactRelay from "react-relay"

import { useTooltipStore } from "@ariakit/react"
import { Effect, pipe } from "effect"
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

import { Remix } from "~/lib/Remix"
import { fab } from "~/lib/button"
import { EffectUrql } from "~/lib/urql"
import { sourceLanguageTag } from "~/paraglide/runtime"

import type { ReactNode } from "react"
import type { routeNavNotificationsQuery as NavNotificationsQuery } from "~/gql/routeNavNotificationsQuery.graphql"
import type { routeNavNotifications_query$key } from "~/gql/routeNavNotifications_query.graphql"
import { commitLocalUpdate, useFragment } from "~/lib/Network"
import { Ariakit } from "~/lib/ariakit"
import MaterialSymbolsDone from "~icons/material-symbols/done"
import { ActivityLike } from "./ActivityLike"
import { Airing } from "./Airing"
import { RelatedMediaAddition } from "./RelatedMediaAddition"

import type { routeNavNotificationsUpdateQuery } from "~/gql/routeNavNotificationsUpdateQuery.graphql"
import type Route from "./+types.route"

const { graphql } = ReactRelay

export const clientLoader = async () => {
	return pipe(
		Effect.gen(function* () {
			const client = yield* EffectUrql

			const data = yield* client.query<NavNotificationsQuery>(
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
		}),
		Effect.provide(EffectUrql.Live),
		Remix.runLoader
	)
}

export const clientAction = (async () => {
	return pipe(
		Effect.gen(function* () {
			const client = yield* EffectUrql
			yield* client.query(
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
				if (updatableData.Viewer)
					updatableData.Viewer.unreadNotificationCount = 0
			})

			return redirect(".")
		}),
		Effect.provide(EffectUrql.Live),
		Remix.runLoader
	)
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
						<div className="fixed bottom-24 end-4 sm:bottom-4">
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

function format(seconds: number) {
	const rtf = new Intl.RelativeTimeFormat(sourceLanguageTag, {})

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

export const meta = (() => {
	return [
		{
			title: `Notifications`,
		},
	]
}) satisfies MetaFunction<typeof clientLoader>
