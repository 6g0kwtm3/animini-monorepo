import type { LoaderFunction } from "@remix-run/cloudflare"
import { Await, Outlet, useLocation } from "@remix-run/react"

import { Effect, Option, Predicate, pipe } from "effect"

import { Remix } from "~/lib/Remix/index.server"
import { useRawLoaderData, useRawRouteLoaderData } from "~/lib/data"
import {
	ClientArgs,
	EffectUrql,
	LoaderArgs,
	LoaderLive
} from "~/lib/urql.server"
import type { loader as rootLoader } from "~/root"

import {
	Navigation,
	NavigationItem,
	NavigationItemIcon,
	NavigationItemLargeBadge
} from "~/components/Navigation"
import { graphql } from "~/lib/graphql"

import { Schema } from "@effect/schema"
import { defer } from "@remix-run/cloudflare"
import { Suspense } from "react"
import { route_login, route_user, route_user_list } from "~/lib/route"
import { Search } from "~/lib/search/Search"

export const loader = (async (args) => {
	return defer(
		{
			trending: pipe(
				pipe(
					Effect.Do,
					Effect.bind("args", () => ClientArgs),
					Effect.bind("client", () => EffectUrql),
					Effect.flatMap(({ client }) =>
						client.query(
							graphql(`
								query NavQuery {
									notifications: Page(perPage: 20) {
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
									trending: Page(perPage: 10) {
										media(sort: [TRENDING_DESC]) {
											id
											...SearchItem_media
										}
									}
								}
							`),
							{}
						)
					)
				),
				Effect.flatMap((data) =>
					Effect.gen(function* (_) {
						const read = Option.getOrElse(
							yield* _(Remix.Cookie("notifications-read", Schema.number)),
							() => 0
						)

						const notifications =
							data?.notifications?.nodes?.findIndex(
								(notification) =>
									notification &&
									Predicate.isNumber(notification?.createdAt) &&
									notification.createdAt <= read
							) ?? 0

						return {
							trending: data?.trending,
							notifications:
								notifications < 0
									? data?.notifications?.nodes?.length
									: notifications
						}
					})
				),

				Effect.provide(LoaderLive),
				Effect.provideService(LoaderArgs, args),
				Remix.runLoader
			)
		},
		{
			headers: {
				"Cache-Control": "max-age=5, stale-while-revalidate=55, private"
			}
		}
	)
}) satisfies LoaderFunction

export default function Nav() {
	const rootData = useRawRouteLoaderData<typeof rootLoader>("root")
	const data = useRawLoaderData<typeof loader>()

	const { pathname } = useLocation()

	return (
		<>
			{/* <nav className="flex flex-wrap gap-2 px-2 py-1">
				{data?.Viewer ? (
					<>

					</>
				) : (
					<>
						<Link
							to={route_login(({
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
				<NavigationItem to="/">
					<NavigationItemIcon>feed</NavigationItemIcon>
					<div className="max-w-full break-words">Feed</div>
				</NavigationItem>
				{rootData?.Viewer ? (
					<>
						<NavigationItem
							to={route_user({ userName: rootData.Viewer.name })}
							end
						>
							<NavigationItemIcon>person</NavigationItemIcon>
							<div className="max-w-full break-words">Profile</div>
						</NavigationItem>
						<NavigationItem
							className="max-sm:hidden"
							to={route_user_list({
								userName: rootData.Viewer.name,
								typelist: "animelist"
							})}
						>
							<NavigationItemIcon>play_arrow</NavigationItemIcon>
							<div className="max-w-full break-words">Anime List</div>
						</NavigationItem>
						<NavigationItem
							to={route_user_list({
								userName: rootData.Viewer.name,
								typelist: "mangalist"
							})}
							className="max-sm:hidden"
						>
							<NavigationItemIcon>menu_book</NavigationItemIcon>
							<div className="max-w-full break-words">Manga List</div>
						</NavigationItem>
					</>
				) : (
					<NavigationItem
						to={route_login({
							redirect: pathname
						})}
					>
						<NavigationItemIcon>person</NavigationItemIcon>
						<div className="max-w-full break-words">Login</div>
					</NavigationItem>
				)}
				<NavigationItem to="/notifications">
					<NavigationItemIcon>notifications</NavigationItemIcon>
					<div className="max-w-full break-words">Notifications</div>
					<Suspense>
						<Await resolve={data.trending}>
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
				<Search></Search>
			</Navigation>

			<Outlet></Outlet>
		</>
	)
}
