import {
	Await,
	Outlet,
	useLocation,
	type ClientLoaderFunctionArgs
} from "@remix-run/react"
import type { LoaderFunction, SerializeFrom } from "@vercel/remix"

import { Effect, Option, Predicate, pipe } from "effect"

import { Remix } from "~/lib/Remix/index.server"
import { useRawLoaderData, useRawRouteLoaderData } from "~/lib/data"
import { EffectUrql, LoaderArgs, LoaderLive } from "~/lib/urql.server"
import type { clientLoader as rootLoader } from "~/root"

import {
	Navigation,
	NavigationItem,
	NavigationItemIcon,
	NavigationItemLargeBadge
} from "~/components/Navigation"
import { graphql } from "~/lib/graphql"

import { Schema } from "@effect/schema"
import { defer } from "@vercel/remix"
import { Suspense, type ReactNode } from "react"
import { route_login, route_user, route_user_list } from "~/lib/route"
import { Search, SearchButton } from "~/lib/search/Search"

import MaterialSymbolsNotifications from "~icons/material-symbols/notifications"
import MaterialSymbolsNotificationsOutline from "~icons/material-symbols/notifications-outline"
import MaterialSymbolsPerson from "~icons/material-symbols/person"

import MaterialSymbolsPersonOutline from "~icons/material-symbols/person-outline"

import MaterialSymbolsFeed from "~icons/material-symbols/feed"
import MaterialSymbolsFeedOutline from "~icons/material-symbols/feed-outline"
import MaterialSymbolsPlayArrow from "~icons/material-symbols/play-arrow"
import MaterialSymbolsPlayArrowOutline from "~icons/material-symbols/play-arrow-outline"

import { Layout } from "~/components/Layout"
import { Viewer } from "~/lib/Remix/Remix.server"
import { getCacheControl } from "~/lib/getCacheControl"
import MaterialSymbolsMenuBook from "~icons/material-symbols/menu-book"
import MaterialSymbolsMenuBookOutline from "~icons/material-symbols/menu-book-outline"

export async function clientLoader(
	args: ClientLoaderFunctionArgs
): Promise<SerializeFrom<typeof loader>> {
	return args.serverLoader<typeof loader>()
}
clientLoader.hydrate = true

export const loader = (async (args) => {
	return defer(
		{
			trending: pipe(
				Effect.gen(function* (_) {
					const client = yield* _(EffectUrql)
					const viewer = yield* _(Viewer)

					const { notifications, ...data } = (yield* _(
						client.query(
							graphql(`
								query NavQuery(
									$coverExtraLarge: Boolean = false
									$isToken: Boolean = false
								) {
									notifications: Page @include(if: $isToken) {
										nodes: notifications {
											__typename
											... on ActivityLikeNotification {
												createdAt
											}
											... on ActivityMentionNotification {
												createdAt
											}
											... on ActivityMessageNotification {
												createdAt
											}
											... on ActivityReplyLikeNotification {
												createdAt
											}
											... on ActivityReplyNotification {
												createdAt
											}
											... on ActivityReplySubscribedNotification {
												createdAt
											}
											... on AiringNotification {
												createdAt
											}
											... on FollowingNotification {
												createdAt
											}
											... on MediaDataChangeNotification {
												createdAt
											}
											... on MediaDeletionNotification {
												createdAt
											}
											... on MediaMergeNotification {
												createdAt
											}
											... on RelatedMediaAdditionNotification {
												createdAt
											}
											... on ThreadCommentLikeNotification {
												createdAt
											}
											... on ThreadCommentMentionNotification {
												createdAt
											}
											... on ThreadCommentReplyNotification {
												createdAt
											}
											... on ThreadCommentSubscribedNotification {
												createdAt
											}
											... on ThreadLikeNotification {
												createdAt
											}
										}
									}
									...Search_query
								}
							`),
							{ isToken: Option.isSome(viewer) }
						)
					)) ?? { trending: null }

					const storedRead = Option.getOrElse(
						Option.isSome(viewer)
							? yield* _(
									Remix.CloudflareKV.store("notifications-read").get(
										viewer.value.id
									)
								)
							: Option.none(),
						() => 0
					)

					const read = Option.getOrElse(
						yield* _(Remix.Cookie("notifications-read", Schema.number)),
						() => 0
					)

					const readNotifications =
						notifications?.nodes?.findIndex(
							(notification) =>
								notification &&
								Predicate.isNumber(notification.createdAt) &&
								notification.createdAt <= Math.max(storedRead, read)
						) ?? 0

					return {
						...data,
						notifications:
							readNotifications < 0
								? notifications?.nodes?.length
								: readNotifications
					}
				}),
				Effect.provide(LoaderLive),
				Effect.provideService(LoaderArgs, args),
				Remix.runLoader
			)
		},
		{
			headers: {
				"Cache-Control": getCacheControl(cacheControl)
			}
		}
	)
}) satisfies LoaderFunction

const cacheControl = {
	maxAge: 15,
	staleWhileRevalidate: 45,
	private: true
}

export default function Nav(): ReactNode {
	const rootData = useRawRouteLoaderData<typeof rootLoader>("root")
	const data = useRawLoaderData<typeof clientLoader>()

	const { pathname } = useLocation()

	return (
		<Layout
			navigation={{
				initial: "bar",
				sm: "rail",
				lg: "drawer"
			}}
		>
			{/* <nav className="flex flex-wrap gap-2 px-2 py-1">
				{data?.Viewer ? (
					<>

					</>
				) : (
					<>
						<Link
							prefetch="intent" to={route_login(({
								redirect: pathname
							}))}
							className={button()}
						>
							Login
						</Link>
					</>
				)}

				<div className="self-end">
					<Search></Search>
				</div>
			</nav> */}

			<Navigation
				variant={{
					initial: "bar",
					sm: "rail",
					lg: "drawer"
				}}
			>
				<NavigationItem prefetch="intent" to="/">
					<NavigationItemIcon>
						<MaterialSymbolsFeedOutline />
						<MaterialSymbolsFeed />
					</NavigationItemIcon>
					<div className="max-w-full break-words">Feed</div>
				</NavigationItem>
				{rootData?.Viewer ? (
					<>
						<NavigationItem
							prefetch="intent"
							to={route_user({ userName: rootData.Viewer.name })}
						>
							<NavigationItemIcon>
								<MaterialSymbolsPersonOutline />
								<MaterialSymbolsPerson />
							</NavigationItemIcon>
							<div className="max-w-full break-words">Profile</div>
						</NavigationItem>
						<NavigationItem
							className="max-sm:hidden"
							prefetch="intent"
							to={route_user_list({
								userName: rootData.Viewer.name,
								typelist: "animelist"
							})}
						>
							<NavigationItemIcon>
								<MaterialSymbolsPlayArrowOutline />
								<MaterialSymbolsPlayArrow />
							</NavigationItemIcon>
							<div className="max-w-full break-words">Anime List</div>
						</NavigationItem>
						<NavigationItem
							prefetch="intent"
							to={route_user_list({
								userName: rootData.Viewer.name,
								typelist: "mangalist"
							})}
							className="max-sm:hidden"
						>
							<NavigationItemIcon>
								<MaterialSymbolsMenuBookOutline />
								<MaterialSymbolsMenuBook />
							</NavigationItemIcon>
							<div className="max-w-full break-words">Manga List</div>
						</NavigationItem>
					</>
				) : (
					<NavigationItem
						prefetch="intent"
						to={route_login({
							redirect: pathname
						})}
					>
						<NavigationItemIcon>
							<MaterialSymbolsPersonOutline />
							<MaterialSymbolsPerson />
						</NavigationItemIcon>
						<div className="max-w-full break-words">Login</div>
					</NavigationItem>
				)}
				<NavigationItem prefetch="intent" to="/notifications">
					<NavigationItemIcon>
						<MaterialSymbolsNotificationsOutline />
						<MaterialSymbolsNotifications />
					</NavigationItemIcon>
					<div className="max-w-full break-words">Notifications</div>
					<Suspense>
						<Await resolve={data.trending} errorElement={<></>}>
							{(data) =>
								(data.notifications ?? 0) > 0 && (
									<NavigationItemLargeBadge>
										{data.notifications}
									</NavigationItemLargeBadge>
								)
							}
						</Await>
					</Suspense>
				</NavigationItem>
				<SearchButton />
			</Navigation>

			<Outlet />
			<Search />
		</Layout>
	)
}
