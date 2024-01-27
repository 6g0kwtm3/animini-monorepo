import {
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useRevalidator
} from "@remix-run/react"
import {
	ClientArgs,
	EffectUrql,
	LoaderArgs,
	LoaderLive
} from "./lib/urql.server"

import { SnackbarQueue } from "./components/Snackbar"

import type { LinksFunction, LoaderFunction } from "@remix-run/node"

import { Analytics } from "@vercel/analytics/react"
import { Effect, Option, pipe } from "effect"
import { useEffect } from "react"
import { Remix } from "./lib/Remix/index.server"
import tailwindcss from "./tailwind.css?url"

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
import { Viewer } from "./lib/Remix/Remix.server"

export const links: LinksFunction = () => {
	return [{ rel: "stylesheet", href: tailwindcss }]
}

const _loader = pipe(
	Effect.Do,
	Effect.bind("args", () => ClientArgs),
	Effect.bind("client", () => EffectUrql),
	Effect.flatMap(({ client, args }) => Viewer),
	Effect.map(Option.getOrNull),
	Effect.map((Viewer) => ({ Viewer }))
)

export const loader = (async (args) => {
	return pipe(
		_loader,
		Effect.provide(LoaderLive),
		Effect.provideService(LoaderArgs, args),
		Remix.runLoader
	)
}) satisfies LoaderFunction

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
			<body className="flex min-h-[100dvh] flex-col">
				<SnackbarQueue>
					<Outlet />
				</SnackbarQueue>
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
				<Analytics />
				<SpeedInsights></SpeedInsights>
			</body>
		</html>
	)
}
