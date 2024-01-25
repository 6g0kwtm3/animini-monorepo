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

const _loader = pipe(
	Effect.Do,
	Effect.bind("args", () => ClientArgs),
	Effect.bind("client", () => EffectUrql),
	Effect.map(({ client }) => null)
)

export const loader = (async (args) => {
	return pipe(
		_loader,
		

		Effect.provide(LoaderLive),
		Effect.provideService(LoaderArgs, args),

		Remix.runLoader
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
			<nav className="flex gap-2 px-2 py-1">
				{data?.Viewer ? (
					<>
						<Link
							prefetch="viewport"
							to={`/${data.Viewer.name}/animelist/`}
							className={button()}
						>
							Anime List
						</Link>
						<Link
							prefetch="viewport"
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

				<div className="ml-auto">
					<Search></Search>
				</div>
			</nav>
			<Outlet></Outlet>
		</>
	)
}
