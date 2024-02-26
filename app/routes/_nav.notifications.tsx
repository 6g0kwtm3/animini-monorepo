import { useTooltipStore } from "@ariakit/react"
import { Schema } from "@effect/schema"
import type { ActionFunction, LoaderFunction } from "@remix-run/cloudflare"
import { Form, Link, json, redirect } from "@remix-run/react"
import cookie from "cookie"
import { Effect, Option, Predicate, pipe } from "effect"
import { serverOnly$ } from "vite-env-only"
import { Card } from "~/components/Card"
import { LayoutBody, LayoutPane } from "~/components/Layout"
import {
	List,
	ListItem,
	ListItemContent,
	ListItemContentSubtitle,
	ListItemContentTitle,
	ListItemImg,
	ListItemTrailingSupportingText
} from "~/components/List"
import {
	TooltipPlain,
	TooltipPlainContainer,
	TooltipPlainTrigger
} from "~/components/Tooltip"
import { graphql } from "~/gql"
import { Viewer } from "~/lib/Remix/Remix.server"
import { Remix } from "~/lib/Remix/index.server"
import { fab } from "~/lib/button"
import { useRawLoaderData } from "~/lib/data"
import { MediaCover } from "~/lib/entry/MediaListCover"
import type { FragmentType } from "~/lib/graphql"
import { useFragment } from "~/lib/graphql"
import { m } from "~/lib/paraglide"
import { route_media } from "~/lib/route"
import { EffectUrql, LoaderArgs, LoaderLive } from "~/lib/urql.server"
import { sourceLanguageTag } from "~/paraglide/runtime"

import MaterialSymbolsWarningOutline from "~icons/material-symbols/warning-outline"

export const loader = (async (args) => {
	return pipe(
		Effect.gen(function* (_) {
			const client = yield* _(EffectUrql)

			const data = yield* _(
				client.query(
					graphql(`
						query NotificationsQuery($coverExtraLarge: Boolean = false) {
							...Notifications_query
						}
					`),
					{}
				)
			)
			const { id } = yield* _(Viewer, Effect.flatten)

			const storedRead = yield* _(
				Remix.CloudflareKV.store("notifications-read").get(id)
			)

			const read = yield* _(Remix.Cookie("notifications-read", Schema.number))

			return {
				Query: data,
				read: Math.max(
					Option.getOrElse(storedRead, () => 0),
					Option.getOrElse(read, () => 0)
				)
			}
		}),
		Effect.map((data) =>
			json(data, {
				headers: {
					"Cache-Control": "max-age=15, stale-while-revalidate=45, private"
				}
			})
		),
		Effect.provide(LoaderLive),
		Effect.provideService(LoaderArgs, args),
		Remix.runLoader
	)
}) satisfies LoaderFunction

export const action = (async (args) => {
	return pipe(
		Effect.gen(function* (_) {
			const formData = yield* _(Remix.formData)
			const { id } = yield* _(yield* _(Viewer))

			const read = Number(formData.get("createdAt"))

			yield* _(Remix.CloudflareKV.store("notifications-read").put(id, read))

			return redirect(".", {
				headers: {
					"Set-Cookie": cookie.serialize(
						"notifications-read",
						JSON.stringify(read),
						{
							sameSite: "lax",
							maxAge: 365 * 24 * 60 * 60, // 1 year
							path: "/"
						}
					)
				}
			})
		}),
		Effect.provide(LoaderLive),
		Effect.provideService(LoaderArgs, args),
		Effect.runPromise
	)
}) satisfies ActionFunction

const Notifications_query = serverOnly$(
	graphql(`
		fragment Notifications_query on Query {
			Page {
				notifications(
					type_in: [AIRING, RELATED_MEDIA_ADDITION, ACTIVITY_LIKE]
				) {
					__typename
					... on AiringNotification {
						id
						...Airing_notification
						createdAt
					}
					... on RelatedMediaAdditionNotification {
						id
						createdAt
						...RelatedMediaAddition_notification
					}
					... on ActivityLikeNotification {
						id
						createdAt
						...ActivityLike_notification
					}
				}
			}
		}
	`)
)
import MaterialSymbolsDone from "~icons/material-symbols/done"
export default function Notifications() {
	const data = useRawLoaderData<typeof loader>()
	const query = useFragment<typeof Notifications_query>(data.Query)

	const store = useTooltipStore()

	const lastCreatedAt = query.Page?.notifications
		?.map(
			(notification) =>
				notification && "createdAt" in notification && notification.createdAt
		)
		.find(Predicate.isNumber)

	const someNotRead = (lastCreatedAt ?? 0) > data.read

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

						<input
							type="hidden"
							value={lastCreatedAt ?? Date.now() / 1000}
							name="createdAt"
						/>
					</Form>
				)}
				<Card variant="elevated" className="max-sm:contents">
					<div className="-mx-4 sm:-my-4">
						<List lines={{ initial: "three", sm: "two" }}>
							{query.Page?.notifications
								?.filter(Predicate.isNotNull)
								.map((notification) => {
									if (notification.__typename === "AiringNotification") {
										return (
											<Airing
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
												key={notification.id}
												notification={notification}
											/>
										)
									}
									if (notification.__typename === "ActivityLikeNotification") {
										return (
											<ActivityLike
												key={notification.id}
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

const Airing_notification = serverOnly$(
	graphql(`
		fragment Airing_notification on AiringNotification {
			id
			episode
			createdAt
			media {
				title {
					userPreferred
				}
				...MediaCover_media
				id
			}
		}
	`)
)

function Airing(props: {
	notification: FragmentType<typeof Airing_notification>
}) {
	const notification = useFragment<typeof Airing_notification>(
		props.notification
	)
	const data = useRawLoaderData<typeof loader>()

	return (
		notification.media && (
			<li className="col-span-full grid grid-cols-subgrid">
				<ListItem
					render={
						<Link
							to={route_media({
								id: notification.media.id
							})}
						/>
					}
				>
					<ListItemImg>
						<MediaCover media={notification.media} />
					</ListItemImg>
					<ListItemContent>
						<ListItemContentTitle>
							{(notification.createdAt ?? 0) > data.read && (
								<MaterialSymbolsWarningOutline className="i-inline inline text-tertiary" />
							)}{" "}
							{m.episode_aired({
								episode: notification.episode
							})}
						</ListItemContentTitle>
						<ListItemContentSubtitle
							title={notification.media.title?.userPreferred ?? undefined}
						>
							{notification.media.title?.userPreferred}
						</ListItemContentSubtitle>
					</ListItemContent>
					{notification.createdAt && (
						<ListItemTrailingSupportingText>
							{format(notification.createdAt - Date.now() / 1000)}
						</ListItemTrailingSupportingText>
					)}
				</ListItem>
			</li>
		)
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

const RelatedMediaAddition_notification = serverOnly$(
	graphql(`
		fragment RelatedMediaAddition_notification on RelatedMediaAdditionNotification {
			id
			createdAt
			media {
				title {
					userPreferred
				}
				...MediaCover_media
				id
			}
		}
	`)
)

function RelatedMediaAddition(props: {
	notification: FragmentType<typeof RelatedMediaAddition_notification>
}) {
	const notification = useFragment<typeof RelatedMediaAddition_notification>(
		props.notification
	)
	const data = useRawLoaderData<typeof loader>()

	return (
		notification.media && (
			<li className="col-span-full grid grid-cols-subgrid">
				<ListItem
					render={
						<Link
							to={route_media({
								id: notification.media.id
							})}
						/>
					}
				>
					<ListItemImg>
						<MediaCover media={notification.media} />
					</ListItemImg>
					<ListItemContent>
						<ListItemContentTitle>
							{(notification.createdAt ?? 0) > data.read && (
								<MaterialSymbolsWarningOutline className="i-inline inline text-tertiary" />
							)}{" "}
							{m.recently_added()}
						</ListItemContentTitle>
						<ListItemContentSubtitle
							title={notification.media.title?.userPreferred ?? undefined}
						>
							{notification.media.title?.userPreferred}
						</ListItemContentSubtitle>
					</ListItemContent>
					{notification.createdAt && (
						<ListItemTrailingSupportingText>
							{format(notification.createdAt - Date.now() / 1000)}
						</ListItemTrailingSupportingText>
					)}
				</ListItem>
			</li>
		)
	)
}

const ActivityLike_notification = serverOnly$(
	graphql(`
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
	`)
)

function ActivityLike(props: {
	notification: FragmentType<typeof ActivityLike_notification>
}) {
	const notification = useFragment<typeof ActivityLike_notification>(
		props.notification
	)
	const data = useRawLoaderData<typeof loader>()

	return (
		notification.user && (
			<ListItem render={<Link to={`/activity/${notification.activityId}`} />}>
				<ListItemImg>
					<img
						src={notification.user.avatar?.large || ""}
						className="h-14 w-14 bg-[image:--bg] bg-cover object-cover"
						style={{
							"--bg": `url(${notification.user.avatar?.medium})`
						}}
						loading="lazy"
						alt=""
					/>
				</ListItemImg>
				<ListItemContent className="grid grid-cols-subgrid">
					<ListItemContentTitle>
						{(notification.createdAt ?? 0) > data.read && (
							<MaterialSymbolsWarningOutline className="i-inline inline text-tertiary" />
						)}{" "}
						{notification.context}
					</ListItemContentTitle>
					<ListItemContentSubtitle title={notification.user.name ?? undefined}>
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
