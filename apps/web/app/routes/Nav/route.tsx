import ReactRelay, { useFragment } from "react-relay"
import { Outlet, useLocation, useRouteLoaderData } from "react-router"
import type { clientLoader as rootLoader } from "~/root"
import MaterialSymbolsTravelExplore from "~icons/material-symbols/travel-explore"

import {
	Navigation,
	NavigationItem,
	NavigationItemLargeBadge,
} from "~/components/Navigation"
import { SearchTrending } from "~/lib/search/SearchTrending"
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
import { UnreadNotificationBadge } from './UnreadNotificationBadge'
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
import { styles } from "./route.styles" with { type: "macro" }
import type { routeNavTrendingQuery } from "~/gql/routeNavTrendingQuery.graphql"
import type { UnreadNotificationBadge_query$key } from "~/gql/UnreadNotificationBadge_query.graphql"

const { graphql } = ReactRelay

export const clientLoader = (args: Route.ClientLoaderArgs) => {
	const data = args.context.get(loadQuery)<routeNavQuery>(
		graphql`
			query routeNavQuery @raw_response_type {
				Viewer: userFromToken @required(action: THROW)
				...UnreadNotificationBadge_query @alias
			}
		`,
		{}
	)

	const { searchParams } = args.url

	const routeNavTrendingQueryRef =
		searchParams.get("sheet") === "search"
			? args.context.get(loadQuery)<routeNavTrendingQuery>(
					graphql`
						query routeNavTrendingQuery @raw_response_type {
							...SearchTrending_query @alias
						}
					`,
					{}
				)
			: null

	return { trending: data, routeNavTrendingQueryRef }
}

export default function NavRoute({
	loaderData,
}: Route.ComponentProps): ReactNode {
	const { pathname } = useLocation()
	return (
		<Layout style={styles.layout}>
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
					href="/"
					icon={<MaterialSymbolsFeedOutline />}
					activeIcon={<MaterialSymbolsFeed />}
				>
					Feed
				</NavigationItem>
				<ErrorBoundary
					fallback={
						// TODO: differentiate between logged in/out, runtime and network error
						<NavigationItem
							href={route_login({ redirect: pathname })}
							icon={<MaterialSymbolsPersonOutline />}
							activeIcon={<MaterialSymbolsPerson />}
						>
							Login
						</NavigationItem>
					}
				>
					<ViewerButtons queryRef={loaderData.trending}></ViewerButtons>
				</ErrorBoundary>
				<SearchButton
					render={
						<NavigationItem
							href={"/search"}
							className={"sm:hidden"}
							icon={<MaterialSymbolsTravelExplore />}
							activeIcon={<MaterialSymbolsTravelExplore />}
						></NavigationItem>
					}
				>
					Explore
				</SearchButton>
			</Navigation>
			<Outlet />
			<Search>
				{loaderData.routeNavTrendingQueryRef != null ? (
					<ErrorBoundary fallback={<>Error</>}>
						<Suspense fallback="">
							<SearchTrendingData
								queryRef={loaderData.routeNavTrendingQueryRef}
							/>
						</Suspense>
					</ErrorBoundary>
				) : null}
			</Search>
		</Layout>
	)
}

function SearchTrendingData({
	queryRef,
}: {
	queryRef: NodeAndQueryFragment<routeNavTrendingQuery>
}) {
	const data = usePreloadedQuery(queryRef)

	return <SearchTrending query={data.SearchTrending_query} />
}

function ViewerButtons(props: {
	queryRef: NodeAndQueryFragment<routeNavQuery>
}) {
	const rootData = usePreloadedQuery(props.queryRef)
	return (
		<>
			<NavigationItem
				href={route_user({ userName: rootData.Viewer.name })}
				icon={<MaterialSymbolsPersonOutline />}
				activeIcon={<MaterialSymbolsPerson />}
			>
				Profile
			</NavigationItem>
			<NavigationItem
				className="max-sm:hidden"
				href={route_user_list({
					userName: rootData.Viewer.name,
					typelist: "animelist",
				})}
				icon={<MaterialSymbolsPlayArrowOutline />}
				activeIcon={<MaterialSymbolsPlayArrow />}
			>
				Anime List
			</NavigationItem>
			<NavigationItem
				href={route_user_list({
					userName: rootData.Viewer.name,
					typelist: "mangalist",
				})}
				className="max-sm:hidden"
				icon={<MaterialSymbolsMenuBookOutline />}
				activeIcon={<MaterialSymbolsMenuBook />}
			>
				Manga List
			</NavigationItem>
			<NavigationItem
				href="/notifications"
				icon={<MaterialSymbolsNotificationsOutline />}
				activeIcon={<MaterialSymbolsNotifications />}
				badge={
					<ErrorBoundary>
						<Suspense>
							<UnreadNotificationBadge
								queryKey={rootData.UnreadNotificationBadge_query}
							/>
						</Suspense>
					</ErrorBoundary>
				}
			>
				Notifications
			</NavigationItem>
		</>
	)
}
