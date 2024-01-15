import {
	ClientLoaderFunction,
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useRevalidator,
} from "@remix-run/react"
import { Provider } from "urql"
import { ClientArgs, ClientLoaderLive, EffectUrql, LoaderArgs, LoaderLive, ssr, urql } from "./lib/urql"

import { SnackbarQueue } from "./components/Snackbar"

import type { LoaderFunction } from "@remix-run/node"

import { Effect, Sink, Stream, pipe } from "effect"
import { useEffect } from "react"
import { graphql } from "./gql"
import { IS_SERVER } from "./lib/isClient"
import "./tailwind.css"

const ViewerQuery = graphql(`
	query ViewerQuery {
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
	Stream.flatMap(({ client, args }) => client.query(ViewerQuery, {})),
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
}) satisfies ClientLoaderFunction

export default function App() {
	const data = IS_SERVER ? ssr.extractData() : window.__URQL_DATA__

	const revalidator = useRevalidator()

	useEffect(() => {
		function listener() {
			if (
				document.visibilityState === "visible" &&
				revalidator.state === "idle"
			) {
				console.log('revalidate')
				revalidator.revalidate()
			}
		}
		window.addEventListener("visibilitychange", listener)
		return () => window.removeEventListener("visibilitychange", listener)
	}, [revalidator])

	return (
		<html lang="en" className="bg-surface text-on-surface overflow-x-hidden">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link
					rel="stylesheet"
					href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0..1,-25..0"
				/>

				<Meta />
				<Links />
			</head>
			<body>
				<script
					dangerouslySetInnerHTML={{
						__html: `window.__URQL_DATA__ = (${JSON.stringify(data)});`,
					}}
				></script>
				<Provider value={urql}>
					<SnackbarQueue>
						<Outlet />
					</SnackbarQueue>
				</Provider>
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
			</body>
		</html>
	)
}
