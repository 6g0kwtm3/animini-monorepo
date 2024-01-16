import type { LoaderFunction } from "@remix-run/node"
import {
	Form,
	Link,
	Outlet,
	useLocation,
	useRouteLoaderData,
} from "@remix-run/react"

import { Effect, pipe } from "effect"

import { ButtonText } from "~/components/Button"
import { button } from "~/lib/button"
import {
	ClientArgs,
	ClientLoaderLive,
	EffectUrql,
	LoaderArgs,
	LoaderLive,
	raw,
	useRawRouteLoaderData,
} from "~/lib/urql"

import type { loader as rootLoader } from "~/root"

const _loader = pipe(
	Effect.Do,
	Effect.bind("args", () => ClientArgs),
	Effect.bind("client", () => EffectUrql),
	Effect.map(({ client }) => null),
)

export const loader = (async (args) => {
	return pipe(
		_loader,
		Effect.map(raw),

		Effect.provide(LoaderLive),
		Effect.provideService(LoaderArgs, args),
		Effect.runPromise,
	)
}) satisfies LoaderFunction

export const clientLoader = (async (args) => {
	return pipe(
		_loader,
		Effect.map(raw),

		Effect.provide(ClientLoaderLive),
		Effect.provideService(LoaderArgs, args),
		Effect.runPromise,
	)
}) satisfies LoaderFunction

export default function Nav() {
	const data = useRawRouteLoaderData<typeof rootLoader>("root")

	const { pathname } = useLocation()

	return (
		<>
			<nav className="flex gap-2">
				{data?.Viewer ? (
					<>
						<Link to={`${data.Viewer.name}/animelist/`} className={button()}>
							Anime List
						</Link>
						<Link to={`${data.Viewer.name}/mangalist/`} className={button()}>
							Manga List
						</Link>
						<Form
							method="post"
							action={`/logout/?${new URLSearchParams({
								redirect: pathname,
							})}`}
						>
							<ButtonText type="submit">Logout</ButtonText>
						</Form>
					</>
				) : (
					<>
						<Link
							state={{
								redirect: `${pathname}/edit`,
							}}
							to={`/login/?${new URLSearchParams({
								redirect: `${pathname}/edit`,
							})}`}
							className={button()}
						>
							Login
						</Link>
					</>
				)}
			</nav>
			<Outlet></Outlet>
		</>
	)
}
