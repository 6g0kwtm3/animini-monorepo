import type { LoaderFunction } from "@remix-run/node"
import { Form, Link, Outlet, useLocation } from "@remix-run/react"

import { Effect, Sink, Stream, pipe } from "effect"

import { ButtonText } from "~/components/Button"
import { graphql } from "~/gql"
import { button } from "~/lib/button"
import {
	ClientArgs,
	ClientLoaderLive,
	EffectUrql,
	LoaderArgs,
	LoaderLive,
	raw,
	useLoader,
	useRawLoaderData,
} from "~/lib/urql"

const NavQuery = graphql(`
	query NavQuery {
		Viewer {
			id
			name
		}
	}
`)

const _loader = pipe(
	Stream.Do,
	Stream.bind("args", () => ClientArgs),
	Stream.bind("client", () => EffectUrql),
	Stream.flatMap(({ client }) => client.query(NavQuery, {})),
)

export const loader = (async (args) => {
	return pipe(
		_loader,
		Stream.run(Sink.head()),
		Effect.flatten,
		Effect.map(raw),
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
		Effect.map(raw),
		Effect.provide(ClientLoaderLive),
		Effect.provideService(LoaderArgs, args),
		Effect.runPromise,
	)
}) satisfies LoaderFunction

export default function Layout() {
	const data = useLoader(_loader, useRawLoaderData<typeof loader>())

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
