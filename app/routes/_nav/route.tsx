import {
	Link,
	Outlet,
	unstable_defineClientLoader,
	useLocation,
	useRouteLoaderData,
	type ShouldRevalidateFunction,
} from "@remix-run/react"
import ReactRelay from "react-relay"

import { RootQuery, type clientLoader as rootLoader } from "~/root"

import {
	Navigation,
	NavigationItemIcon,
	NavigationItemLargeBadge,
} from "~/components/Navigation"

import { type ReactNode } from "react"
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
import { fab } from "~/lib/button"
import MaterialSymbolsHome from "~icons/material-symbols/home"
import MaterialSymbolsHomeOutline from "~icons/material-symbols/home-outline"
import MaterialSymbolsMenuBook from "~icons/material-symbols/menu-book"
import MaterialSymbolsMenuBookOutline from "~icons/material-symbols/menu-book-outline"
import { NavigationItem } from "./NavigationItem"

import environment, { loadQuery, usePreloadedQuery } from "~/lib/Network"
import { searchTrendingQuery } from "~/lib/search/SearchTrendingQuery"
import MaterialSymbolsTravelExplore from "~icons/material-symbols/travel-explore"

const { graphql } = ReactRelay

export const clientLoader = unstable_defineClientLoader(async (args) => {
	const data = loadQuery<NavQuery>(environment, searchTrendingQuery, {})

	return {
		trending: data,
	}
})

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
	const root = usePreloadedQuery(
		RootQuery,
		useRouteLoaderData<typeof rootLoader>("root")!.query
	)

	const { pathname } = useLocation()

	return (
		<Layout
			navigation={{
				initial: "bar",
				sm: "rail",
			}}
		>
			<Navigation
				variant={{
					initial: "bar",
					sm: "rail",
				}}
			>
				<SearchButton
					render={
						<Link
							className={fab({ className: "mx-3 max-sm:hidden" })}
							to={{
								search: `?sheet=search`,
							}}
						>
							<MaterialSymbolsTravelExplore />
						</Link>
					}
				/>

				<NavigationItem to="/">
					<NavigationItemIcon>
						<MaterialSymbolsHomeOutline />
						<MaterialSymbolsHome />
					</NavigationItemIcon>
					<div className="max-w-full break-words">Home</div>
				</NavigationItem>
				<NavigationItem to="/feed" className="max-sm:hidden">
					<NavigationItemIcon>
						<MaterialSymbolsFeedOutline />
						<MaterialSymbolsFeed />
					</NavigationItemIcon>
					<div className="max-w-full break-words">Feed</div>
				</NavigationItem>
				{root.Viewer ? (
					<>
						<NavigationItem to={route_user({ userName: root.Viewer.name })} end>
							<NavigationItemIcon>
								<MaterialSymbolsPersonOutline />
								<MaterialSymbolsPerson />
							</NavigationItemIcon>
							<div className="max-w-full break-words">Profile</div>
						</NavigationItem>
						<NavigationItem
							className="max-sm:hidden"
							to={route_user_list({
								userName: root.Viewer.name,
								typelist: "animelist",
							})}
						>
							<NavigationItemIcon>
								<MaterialSymbolsPlayArrowOutline />
								<MaterialSymbolsPlayArrow />
							</NavigationItemIcon>
							<div className="max-w-full break-words">Anime List</div>
						</NavigationItem>
						<NavigationItem
							to={route_user_list({
								userName: root.Viewer.name,
								typelist: "mangalist",
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
						to={route_login({
							redirect: pathname,
						})}
					>
						<NavigationItemIcon>
							<MaterialSymbolsPersonOutline />
							<MaterialSymbolsPerson />
						</NavigationItemIcon>
						<div className="max-w-full break-words">Login</div>
					</NavigationItem>
				)}
				<NavigationItem to="/notifications">
					<NavigationItemIcon>
						<MaterialSymbolsNotificationsOutline />
						<MaterialSymbolsNotifications />
					</NavigationItemIcon>
					<div className="max-w-full break-words">Notifications</div>

					{(root.Viewer?.unreadNotificationCount ?? 0) > 0 && (
						<NavigationItemLargeBadge>
							{root.Viewer?.unreadNotificationCount}
						</NavigationItemLargeBadge>
					)}
				</NavigationItem>
				<SearchButton
					render={
						<NavigationItem to={"/search"} className={"sm:hidden"}>
							<NavigationItemIcon>
								<MaterialSymbolsTravelExplore />
								<MaterialSymbolsTravelExplore />
							</NavigationItemIcon>

							<div className="max-w-full break-words">Explore</div>
						</NavigationItem>
					}
				/>
			</Navigation>

			<Outlet />
			<Search />
		</Layout>
	)
}
