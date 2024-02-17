import type { LoaderFunction } from "@remix-run/cloudflare"
import { Outlet, useLocation } from "@remix-run/react"

import { Effect, pipe } from "effect"

import { Remix } from "~/lib/Remix/index.server"
import { useRawRouteLoaderData } from "~/lib/data"
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

import { defer } from "@remix-run/cloudflare"
import { LayoutBody } from "~/components/Layout"
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
					),
					Effect.map((data) => data?.trending ?? null)
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

// export const clientLoader = (async (args) => {
// 	return pipe(
// 		_loader,
//

// 		Effect.provide(ClientLoaderLive),
// 		Effect.provideService(LoaderArgs, args),

// 		Remix.runLoader
// 	)
// }) satisfies LoaderFunction

export default function Nav() {
	const data = useRawRouteLoaderData<typeof rootLoader>("root")

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
				{data?.Viewer ? (
					<>
						<NavigationItem to={route_user({ userName: data.Viewer.name })} end>
							<NavigationItemIcon>person</NavigationItemIcon>
							<div className="max-w-full break-words">Profile</div>
						</NavigationItem>
						<NavigationItem
							className="max-sm:hidden"
							to={route_user_list({
								userName: data.Viewer.name,
								typelist: "animelist"
							})}
						>
							<NavigationItemIcon>play_arrow</NavigationItemIcon>
							<div className="max-w-full break-words">Anime List</div>
						</NavigationItem>
						<NavigationItem
							to={route_user_list({
								userName: data.Viewer.name,
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
					<NavigationItemLargeBadge>777</NavigationItemLargeBadge>
				</NavigationItem>
				<Search></Search>
			</Navigation>
			<LayoutBody className="sm:ps-0">
				<Outlet></Outlet>
			</LayoutBody>
		</>
	)
}
