import ReactRelay from "react-relay"
import {
	Await,
	Outlet,
	useLoaderData,
	useLocation,
	useRouteLoaderData,
	type ClientLoaderFunctionArgs,
	type ShouldRevalidateFunction,
} from "react-router"
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

import type { routeNavQuery as NavQuery } from "~/gql/routeNavQuery.graphql"

import { A } from "a"
import { fab } from "~/lib/button"
import { client_get_client } from "~/lib/client"
import MaterialSymbolsMenuBook from "~icons/material-symbols/menu-book"
import MaterialSymbolsMenuBookOutline from "~icons/material-symbols/menu-book-outline"

const { graphql } = ReactRelay

export const clientLoader = async (_args: ClientLoaderFunctionArgs) => {
	const client = client_get_client()
	const viewer = Viewer()

	const data = await client.query<NavQuery>(
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

export const shouldRevalidate: ShouldRevalidateFunction = ({
	defaultShouldRevalidate,
	formMethod,
}) => {
	if (formMethod?.toLocaleUpperCase() === "GET") {
		return false
	}
	return defaultShouldRevalidate
}

export default function NavRoute(): ReactNode {
	const rootData = useRouteLoaderData<typeof rootLoader>("root")
	const data = useLoaderData<typeof clientLoader>()

	const { pathname } = useLocation()

	return (
		<Layout className="layout-navigation-bar sm:layout-navigation-rail lg:layout-navigation-drawer">
			<Navigation className="navigation-bar sm:navigation-rail lg:navigation-drawer">
				<SearchButton
					render={
						<A
							className={fab({ className: "mx-3 max-sm:hidden" })}
							href={{ search: `?sheet=search` }}
						>
							<MaterialSymbolsTravelExplore />
						</A>
					}
				/>
				<NavigationItem
					href="/"
					icon={<MaterialSymbolsFeedOutline />}
					activeIcon={<MaterialSymbolsFeed />}
				>
					Feed
				</NavigationItem>
				{rootData?.Viewer ? (
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
					</>
				) : (
					<NavigationItem
						href={route_login({ redirect: pathname })}
						icon={<MaterialSymbolsPersonOutline />}
						activeIcon={<MaterialSymbolsPerson />}
					>
						Login
					</NavigationItem>
				)}
				<NavigationItem
					href="/notifications"
					icon={<MaterialSymbolsNotificationsOutline />}
					activeIcon={<MaterialSymbolsNotifications />}
					badge={
						<Suspense>
							<Await resolve={data.trending} errorElement={null}>
								{(data) =>
									(data?.Viewer?.unreadNotificationCount ?? 0) > 0 && (
										<NavigationItemLargeBadge>
											{data?.Viewer?.unreadNotificationCount}
										</NavigationItemLargeBadge>
									)
								}
							</Await>
						</Suspense>
					}
				>
					Notifications
				</NavigationItem>
				<SearchButton
					render={
						<NavigationItem
							href={"/search"}
							className={"sm:hidden"}
							icon={<MaterialSymbolsTravelExplore />}
							activeIcon={<MaterialSymbolsTravelExplore />}
						>
							Explore
						</NavigationItem>
					}
				/>
			</Navigation>
			<Outlet />
			<Search />
		</Layout>
	)
}
