import {
	Links,
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

import type { LinksFunction, LoaderFunction } from "@remix-run/cloudflare"

import { Effect, Option, pipe } from "effect"
import { Remix } from "./lib/Remix/index.server"
import "./tailwind.css"

// export const clientLoader = (async (args) => {
// 	return pipe(
// 		_loader,
//

// 		Effect.provide(ClientLoaderLive),
// 		Effect.provideService(LoaderArgs, args),

// 		Remix.runLoader
// 	)
// }) satisfies ClientLoaderFunction
import { useEffect } from "react"
import { Viewer } from "./lib/Remix/Remix.server"

export const links: LinksFunction = () => {
	return [
		{
			rel: "stylesheet",
			href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0..1,-25..0"
		}
	]
}

export const loader = (async (args) => {
	return pipe(
		pipe(
			Effect.Do,
			Effect.bind("args", () => ClientArgs),
			Effect.bind("client", () => EffectUrql),
			Effect.flatMap(({ client, args }) => Viewer),
			Effect.map(Option.getOrNull),
			Effect.map((Viewer) => ({ Viewer }))
		),
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

				<Meta />
				<Links />
			</head>
			<body className="flex min-h-[100dvh] flex-col">
				<SnackbarQueue>
					<Outlet />
				</SnackbarQueue>
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	)
}
