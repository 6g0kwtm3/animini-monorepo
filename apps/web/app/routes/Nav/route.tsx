import ReactRelay from "react-relay"
import { Outlet, useLocation, useRouteLoaderData } from "react-router"
import { Viewer } from "~/lib/Remix"
import type { clientLoader as rootLoader } from "~/root"
import MaterialSymbolsTravelExplore from "~icons/material-symbols/travel-explore"

import {
	Navigation,
	NavigationItem,
	NavigationItemLargeBadge,
} from "~/components/Navigation"

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

import type { routeNavQuery } from "~/gql/routeNavQuery.graphql"

import { A } from "@anitrove/a"
import * as Ariakit from "@ariakit/react"
import { ErrorBoundary } from "@sentry/react"
import { fab } from "~/lib/button"
import {
	loadQuery,
	usePreloadedQuery,
	type NodeAndQueryFragment,
} from "~/lib/Network"
import MaterialSymbolsMenuBook from "~icons/material-symbols/menu-book"
import MaterialSymbolsMenuBookOutline from "~icons/material-symbols/menu-book-outline"
import type { Route } from "./+types/route"

const { graphql } = ReactRelay

export const clientLoader = (args: Route.ClientLoaderArgs) => {
	const viewer = Viewer()

	const data = args.context.get(loadQuery)<routeNavQuery>(
		graphql`
			query routeNavQuery($isToken: Boolean = false) {
				Viewer @include(if: $isToken) {
					id
					unreadNotificationCount
				}
				...SearchTrending_query
			}
		`,
		{ isToken: viewer != null }
	)

	return { trending: data }
}

export default function NavRoute({
	loaderData,
}: Route.ComponentProps): ReactNode {
	const rootData = useRouteLoaderData<typeof rootLoader>("root")

	const { pathname } = useLocation()

	return (
		<Layout className="layout-navigation-bar sm:layout-navigation-rail">
			<Navigation className="navigation-bar sm:navigation-rail sm:navigation-start">
				<Ariakit.ToolbarItem
					render={
						<SearchButton
							render={
								<A
									className={fab({ className: "mx-3 max-sm:hidden" })}
									href={{ search: `?sheet=search` }}
								></A>
							}
						></SearchButton>
					}
				>
					<MaterialSymbolsTravelExplore />
				</Ariakit.ToolbarItem>
				<NavigationItem
					activeIcon={<MaterialSymbolsFeed />}
					href="/"
					icon={<MaterialSymbolsFeedOutline />}
				>
					Feed
				</NavigationItem>
				{rootData?.Viewer ? (
					<>
						<NavigationItem
							activeIcon={<MaterialSymbolsPerson />}
							href={route_user({ userName: rootData.Viewer.name })}
							icon={<MaterialSymbolsPersonOutline />}
						>
							Profile
						</NavigationItem>
						<NavigationItem
							activeIcon={<MaterialSymbolsPlayArrow />}
							className="max-sm:hidden"
							href={route_user_list({
								typelist: "animelist",
								userName: rootData.Viewer.name,
							})}
							icon={<MaterialSymbolsPlayArrowOutline />}
						>
							Anime List
						</NavigationItem>
						<NavigationItem
							activeIcon={<MaterialSymbolsMenuBook />}
							className="max-sm:hidden"
							href={route_user_list({
								typelist: "mangalist",
								userName: rootData.Viewer.name,
							})}
							icon={<MaterialSymbolsMenuBookOutline />}
						>
							Manga List
						</NavigationItem>
					</>
				) : (
					<NavigationItem
						activeIcon={<MaterialSymbolsPerson />}
						href={route_login({ redirect: pathname })}
						icon={<MaterialSymbolsPersonOutline />}
					>
						Login
					</NavigationItem>
				)}
				<NavigationItem
					activeIcon={<MaterialSymbolsNotifications />}
					badge={
						<ErrorBoundary>
							<Suspense>
								<UnreadNotificationBadge queryRef={loaderData.trending} />
							</Suspense>
						</ErrorBoundary>
					}
					href="/notifications"
					icon={<MaterialSymbolsNotificationsOutline />}
				>
					Notifications
				</NavigationItem>
				<SearchButton
					render={
						<NavigationItem
							activeIcon={<MaterialSymbolsTravelExplore />}
							className={"sm:hidden"}
							href={"/search"}
							icon={<MaterialSymbolsTravelExplore />}
						></NavigationItem>
					}
				>
					Explore
				</SearchButton>
			</Navigation>
			<Outlet />
			<Search queryRef={loaderData.trending} />
		</Layout>
	)
}

function UnreadNotificationBadge({
	queryRef,
}: {
	queryRef: NodeAndQueryFragment<routeNavQuery>
}): ReactNode {
	const data = usePreloadedQuery(queryRef)

	return (
		(data.Viewer?.unreadNotificationCount ?? 0) > 0 && (
			<NavigationItemLargeBadge>
				{data.Viewer?.unreadNotificationCount}
			</NavigationItemLargeBadge>
		)
	)
}
