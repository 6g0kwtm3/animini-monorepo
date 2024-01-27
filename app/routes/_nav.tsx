import type { LoaderFunction } from "@remix-run/node"
import { Form, Link, Outlet, useLocation } from "@remix-run/react"

import { Effect, pipe } from "effect"

import { ButtonText } from "~/components/Button"
import { Remix } from "~/lib/Remix"
import { button } from "~/lib/button"
import { Search } from "~/lib/search/Search"
import {
	ClientArgs,
	EffectUrql,
	LoaderArgs,
	LoaderLive,
	useRawRouteLoaderData
} from "~/lib/urql"

import type { loader as rootLoader } from "~/root"

import {
	NavigationBar,
	NavigationBarItem,
	NavigationBarItemIcon,
	NavigationItemLargeBadge
} from "~/components/NavigationBar"
import { graphql } from "~/gql"

import { defer } from "@remix-run/node"

const NavQuery = graphql(`
	query NavQuery {
		trending: Page(perPage: 10) {
			media(sort: [TRENDING_DESC]) {
				id
				...SearchItem_media
			}
		}
	}
`)

const _loader = pipe(
	Effect.Do,
	Effect.bind("args", () => ClientArgs),
	Effect.bind("client", () => EffectUrql),
	Effect.flatMap(({ client }) => client.query(NavQuery, {})),
	Effect.map((data) => data?.trending ?? null)
)

export const loader = (async (args) => {
	return defer({
		trending: pipe(
			_loader,
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
						<Link
							prefetch="intent"
							to={`/${data.Viewer.name}/animelist/`}
							className={button()}
						>
							Anime List
						</Link>
						<Link
							prefetch="intent"
							to={`/${data.Viewer.name}/mangalist/`}
							className={button()}
						>
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
			<main className="flex-1">
				<Outlet></Outlet>
			</main>

			{data?.Viewer && (
				<NavigationBar>
					<NavigationBarItem to="/">
						<NavigationBarItemIcon>feed</NavigationBarItemIcon>
						Feed
					</NavigationBarItem>
					<NavigationBarItem
						prefetch="intent"
						to={`/${data.Viewer.name}/animelist/`}
					>
						<NavigationBarItemIcon>person</NavigationBarItemIcon>
						Profile
					</NavigationBarItem>
					<NavigationBarItem to="/notifications">
						<NavigationBarItemIcon>notifications</NavigationBarItemIcon>
						<NavigationItemLargeBadge>7</NavigationItemLargeBadge>
						Notifications
					</NavigationBarItem>
				</NavigationBar>
			)}
		</>
	)
}
