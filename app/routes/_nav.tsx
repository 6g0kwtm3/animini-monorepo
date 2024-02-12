import type { LoaderFunction } from "@remix-run/cloudflare"
import { Form, Link, Outlet, useLocation } from "@remix-run/react"

import { Effect, pipe } from "effect"

import { ButtonText } from "~/components/Button"
import { Remix } from "~/lib/Remix/index.server"
import { button } from "~/lib/button"
import { useRawRouteLoaderData } from "~/lib/data"
import { Search } from "~/lib/search/Search"
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
import { Layout } from "~/components/Layout"

export const loader = (async (args) => {
	return defer({
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
	})
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
			<nav className="flex flex-wrap gap-2 px-2 py-1">
				{data?.Viewer ? (
					<>
						<Link to={`/${data.Viewer.name}/animelist/`} className={button()}>
							Anime List
						</Link>
						<Link to={`/${data.Viewer.name}/mangalist/`} className={button()}>
							Manga List
						</Link>
						<Form
							method="post"
							action={`/logout/?${new URLSearchParams({
								redirect: pathname
							})}`}
						>
							<ButtonText type="submit">Logout</ButtonText>
						</Form>
					</>
				) : (
					<>
						<Link
							to={`/login/?${new URLSearchParams({
								redirect: pathname
							})}`}
							className={button()}
						>
							Login
						</Link>
					</>
				)}

				<div className="self-end">
					<Search></Search>
				</div>
			</nav>

			<main className="flex flex-1 flex-col sm:flex-row">
				{data?.Viewer && (
					<>
						<Navigation
							className="max-sm:order-last max-sm:w-full"
							variant={{
								initial: "bar",
								sm: "rail",
								lg: "drawer"
							}}
						>
							<NavigationItem to="/">
								<NavigationItemIcon>feed</NavigationItemIcon>
								<div className="truncate max-w-full">Feed</div>
							</NavigationItem>
							<NavigationItem
								to={`/${data.Viewer.name}/`}
								className="max-sm:hidden"
								end
							>
								<NavigationItemIcon>person</NavigationItemIcon>
								<div className="truncate max-w-full">Profile</div>
							</NavigationItem>
							<NavigationItem to={`/${data.Viewer.name}/animelist/`}>
								<NavigationItemIcon>play_arrow</NavigationItemIcon>
								<div className="truncate max-w-full">Anime List</div>
							</NavigationItem>
							<NavigationItem
								to={`/${data.Viewer.name}/mangalist/`}
								className="max-sm:hidden"
							>
								<NavigationItemIcon>menu_book</NavigationItemIcon>
								<div className="truncate max-w-full">Manga List</div>
							</NavigationItem>
							<NavigationItem to="/notifications">
								<NavigationItemIcon>notifications</NavigationItemIcon>
								<div className="truncate max-w-full">Notifications</div>
								<NavigationItemLargeBadge>777</NavigationItemLargeBadge>
							</NavigationItem>
						</Navigation>
					</>
				)}
				<Layout className="sm:-ms-6">
					<Outlet></Outlet>
				</Layout>
			</main>
		</>
	)
}
