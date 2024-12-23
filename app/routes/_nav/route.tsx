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

import {
	Navigation,
	NavigationItem,
	NavigationItemIcon,
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

import { client_get_client } from "~/lib/client"
import MaterialSymbolsMenuBook from "~icons/material-symbols/menu-book"
import MaterialSymbolsMenuBookOutline from "~icons/material-symbols/menu-book-outline"

const { graphql } = ReactRelay

export const clientLoader = async (args: ClientLoaderFunctionArgs) => {
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
		<Layout
			navigation={{
				initial: "bar",
				sm: "rail",
				lg: "drawer",
			}}
		>
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
					lg: "drawer",
				}}
			>
				<NavigationItem to="/">
					<NavigationItemIcon>
						<MaterialSymbolsFeedOutline />
						<MaterialSymbolsFeed />
					</NavigationItemIcon>
					<div className="max-w-full break-words">Feed</div>
				</NavigationItem>
				{rootData?.Viewer ? (
					<>
						<NavigationItem to={route_user({ userName: rootData.Viewer.name })}>
							<NavigationItemIcon>
								<MaterialSymbolsPersonOutline />
								<MaterialSymbolsPerson />
							</NavigationItemIcon>
							<div className="max-w-full break-words">Profile</div>
						</NavigationItem>
						<NavigationItem
							className="max-sm:hidden"
							to={route_user_list({
								userName: rootData.Viewer.name,
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
								userName: rootData.Viewer.name,
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
					<Suspense>
						<Await resolve={data.trending} errorElement={<></>}>
							{(data) =>
								(data?.Viewer?.unreadNotificationCount ?? 0) > 0 && (
									<NavigationItemLargeBadge>
										{data?.Viewer?.unreadNotificationCount}
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
