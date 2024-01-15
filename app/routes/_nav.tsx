import type { LoaderFunction } from "@remix-run/node"
import { Form, Link, Outlet, useLocation, useRouteLoaderData } from "@remix-run/react"

import { Effect, Sink, Stream, pipe } from "effect"

import { ButtonText } from "~/components/Button"
import { button } from "~/lib/button"
import {
	ClientArgs,
	ClientLoaderLive,
	EffectUrql,
	LoaderArgs,
	LoaderLive
} from "~/lib/urql"

import type { loader as rootLoader } from '~/root'

 

const _loader = pipe(
	Stream.Do,
	Stream.bind("args", () => ClientArgs),
	Stream.bind("client", () => EffectUrql),
	Stream.map(({ client }) => null),
)

export const loader = (async (args) => {
	return pipe(
		_loader,
		Stream.run(Sink.head()),
		Effect.flatten,
		
		Effect.provide(LoaderLive),
		Effect.provideService(LoaderArgs, args),
		Effect.runPromise,
	)
}) satisfies LoaderFunction

export const clientLoader = (async (args) => {
	return pipe(
		_loader,
		Stream.run(Sink.head()),
		Effect.flatten,
		Effect.provide(ClientLoaderLive),
		Effect.provideService(LoaderArgs, args),
		Effect.runPromise,
	)
}) satisfies LoaderFunction

export default function Nav() {
	const data = useRouteLoaderData<typeof rootLoader>("root")

	const { pathname } = useLocation()

	return (
		<>
			<nav className="flex gap-2">
				{data?.Viewer ? (
					<>
						<Link to={`${data?.Viewer.name}/animelist`} className={button()}>
							Anime List
						</Link>
						<Link to={`${data?.Viewer.name}/mangalist`} className={button()}>
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
