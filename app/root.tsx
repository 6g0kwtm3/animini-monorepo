import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useRevalidator
} from "@remix-run/react"
import { ClientArgs, EffectUrql, LoaderArgs, LoaderLive } from "./lib/urql"

import { SnackbarQueue } from "./components/Snackbar"

import type { LoaderFunction } from "@remix-run/node"

import { Effect, pipe } from "effect"
import { useEffect } from "react"
import { graphql } from "./gql"
import { Remix } from "./lib/Remix"
import "./tailwind.css"

const ViewerQuery = graphql(`
	query ViewerQuery {
		Viewer {
			id
			name
			mediaListOptions {
				scoreFormat
			}
		}
	}
`)

const _loader = pipe(
	Effect.Do,
	Effect.bind("args", () => ClientArgs),
	Effect.bind("client", () => EffectUrql),
	Effect.flatMap(({ client, args }) => client.query(ViewerQuery, {}))
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
// }) satisfies ClientLoaderFunction
import { SpeedInsights } from "@vercel/speed-insights/remix"

export default function App() {
	const revalidator = useRevalidator()
	useEffect(() => {
		function listener() {
			if (
				document.visibilityState === "visible" &&
				revalidator.state === "idle"
			) {
				console.log("revalidate")
				revalidator.revalidate()
			}
		}
		window.addEventListener("visibilitychange", listener)
		return () => window.removeEventListener("visibilitychange", listener)
	}, [revalidator])

	return (
		<html
			lang="en"
			className="overflow-x-hidden bg-background text-on-background"
		>
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
				<SnackbarQueue>
					<Outlet />
				</SnackbarQueue>
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
				<SpeedInsights></SpeedInsights>
			</body>
		</html>
	)
}
