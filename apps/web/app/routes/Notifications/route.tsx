import { fab } from "@animedes/components/button.styles"
import { Card } from "@animedes/components/Card"
import { LayoutBody, LayoutPane } from "@animedes/components/Layout"
import { List } from "@animedes/components/List"
import * as listStyles from "@animedes/components/List.styles"
import {
	TooltipPlain,
	TooltipPlainContainer,
	TooltipPlainTrigger,
} from "@animedes/components/Tooltip"
import { media } from "@anitrove/design"
import { precompileStyles } from "@anitrove/unstyled"
import * as Ariakit from "@ariakit/react"
import { useTooltipStore } from "@ariakit/react"
import ReactRelay from "react-relay"
import { Form, isRouteErrorResponse, redirect } from "react-router"
import { client_get_client } from "~/lib/client"
import { loadQuery, usePreloadedQuery } from "~/lib/Network"
import MaterialSymbolsDone from "~icons/material-symbols/done"

import { ActivityLike } from "./ActivityLike"
import { Airing } from "./Airing"
import { RelatedMediaAddition } from "./RelatedMediaAddition"

import type { Route } from "./+types/route"
import type { ReactNode } from "react"
import type {
	ActionFunction,
	ClientLoaderFunctionArgs,
	MetaFunction,
} from "react-router"
import type { routeNavNotificationsQuery as routeNavNotificationsQueryOperation } from "~/gql/routeNavNotificationsQuery.graphql"

const { graphql } = ReactRelay

export const clientLoader = (args: ClientLoaderFunctionArgs) => {
	return {
		routeNavNotificationsQuery: args.context.get(
			loadQuery
		)<routeNavNotificationsQueryOperation>(
			graphql`
				query routeNavNotificationsQuery @raw_response_type @throwOnFieldError {
					Viewer @required(action: THROW) {
						id
						unreadNotificationCount
						...Airing_viewer @alias
						...RelatedMediaAddition_viewer @alias
						...ActivityLike_viewer @alias
					}
					Page {
						notifications(
							type_in: [AIRING, RELATED_MEDIA_ADDITION, ACTIVITY_LIKE]
						) {
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
			`,
			{}
		),
	}
}

export const clientAction = (async () => {
	const client = client_get_client()

	await client.query(
		graphql`
			query routeNavNotificationsReadQuery
			@raw_response_type
			@throwOnFieldError {
				Page(perPage: 0) {
					notifications(resetNotificationCount: true) {
						__typename
					}
				}
			}
		`,
		{},
		{ fetchPolicy: "network-only" }
	)

	return redirect(".")
}) satisfies ActionFunction

export default function Page({ loaderData }: Route.ComponentProps): ReactNode {
	const data = usePreloadedQuery(loaderData.routeNavNotificationsQuery)
	const store = useTooltipStore()
	const someNotRead = data.Viewer.unreadNotificationCount ?? 0

	const notifications = data.Page?.notifications?.filter((el) => el != null)
	return (
		<LayoutBody>
			<LayoutPane>
				{someNotRead ? (
					<Form method="post">
						<div className="fixed end-4 bottom-24 sm:bottom-4">
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
				) : null}
				<Card variant="elevated" className="max-sm:contents">
					{!notifications?.length && (
						<Ariakit.Heading>No Notifications</Ariakit.Heading>
					)}

					<div className="-mx-4 sm:-my-4">
						<List
							style={precompileStyles({
								[listStyles.Lines.name]: { base: "three", [media.sm]: "two" },
							})}
						>
							{notifications?.map((notification, i) => {
								if (notification.Airing_notification) {
									return (
										<Airing
											key={notification.id}
											data-key={notification.id}
											notification={notification.Airing_notification}
											viewer={data.Viewer.Airing_viewer}
											first={i === 0}
											last={i === notifications.length - 1}
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
											viewer={data.Viewer.RelatedMediaAddition_viewer}
											first={i === 0}
											last={i === notifications.length - 1}
										/>
									)
								}
								if (notification.ActivityLike_notification) {
									return (
										<ActivityLike
											key={notification.id}
											data-key={notification.id}
											notification={notification.ActivityLike_notification}
											viewer={data.Viewer.ActivityLike_viewer}
											first={i === 0}
											last={i === notifications.length - 1}
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

import * as Sentry from "@sentry/react"

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps): ReactNode {
	// when true, this is what used to go to `CatchBoundary`
	if (isRouteErrorResponse(error)) {
		return (
			<LayoutBody>
				<LayoutPane>
					<div>
						<Ariakit.Heading>Oops</Ariakit.Heading>
						<p>Status: {error.status}</p>
						<p>{error.data}</p>
					</div>
				</LayoutPane>
			</LayoutBody>
		)
	}
	void Sentry.captureException(error)
	// Don't forget to typecheck with your own logic.
	// Any value can be thrown, not just errors!
	let errorMessage = "Unknown error"
	if (Error.isError(error)) {
		errorMessage = error.message || errorMessage
	}

	return (
		<LayoutBody>
			<LayoutPane>
				<Card
					variant="elevated"
					className="bg-error-container text-on-error-container m-4"
				>
					<Ariakit.Heading className="text-headline-md text-balance">
						Uh oh ...
					</Ariakit.Heading>
					<p className="text-headline-sm">Something went wrong.</p>
					<pre className="text-body-md overflow-auto">{errorMessage}</pre>
				</Card>
			</LayoutPane>
		</LayoutBody>
	)
}
