import {
	Await,
	Outlet,
	unstable_defineClientLoader,
	useLocation,
	type ShouldRevalidateFunction
} from "@remix-run/react"

import { Effect, Option, pipe } from "effect"

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

import { unstable_defineLoader } from "@remix-run/cloudflare"

export const clientLoader = unstable_defineClientLoader(async (args) =>
	args.serverLoader<typeof loader>()
)
clientLoader.hydrate = true
export const loader = unstable_defineLoader(async (args) => {
	args.response?.headers.append("Cache-Control", getCacheControl(cacheControl))

	return {
		trending: pipe(
			Effect.gen(function* () {
				const client = yield* EffectUrql
				const viewer = yield* Viewer

				const data = (yield* client.query(
					graphql(`
						query NavQuery(
							$coverExtraLarge: Boolean = false
							$isToken: Boolean = false
						) {
							Viewer @include(if: $isToken) {
								id
								unreadNotificationCount
							}
							...Search_query
						}
					`),
					{ isToken: Option.isSome(viewer) }
				)) ?? { trending: null }

				return data
			}),
			Effect.provide(LoaderLive),
			Effect.provideService(LoaderArgs, args),
			Remix.runLoader
		)
	}
})

export const shouldRevalidate: ShouldRevalidateFunction = ({
	defaultShouldRevalidate,
	formMethod
}) => {
	if (formMethod?.toLocaleUpperCase() === "GET") {
		return false
	}
	return defaultShouldRevalidate
}

const cacheControl = {
	maxAge: 60,
	staleWhileRevalidate: 60 * 5,
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
				<NavigationItem to="/notifications">
					<NavigationItemIcon>
						<MaterialSymbolsNotificationsOutline />
						<MaterialSymbolsNotifications />
					</NavigationItemIcon>
					<div className="max-w-full break-words">Notifications</div>
					<Suspense>
						<Await resolve={data.trending} errorElement={<></>}>
							{(data) =>
								(data.Viewer?.unreadNotificationCount ?? 0) > 0 && (
									<NavigationItemLargeBadge>
										{data.Viewer?.unreadNotificationCount}
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
