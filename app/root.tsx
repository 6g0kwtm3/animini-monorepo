import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	json
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

import { Layout } from "./components/Layout"
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
			Effect.map((viewer) =>
				json(
					{ Viewer: viewer },
					{
						headers: {
							"Cache-Control": "max-age=5, stale-while-revalidate=55, private"
						}
					}
				)
			)
		),
		Effect.provide(LoaderLive),
		Effect.provideService(LoaderArgs, args),
		Remix.runLoader
	)
}) satisfies LoaderFunction

export default function App() {
	return (
		<html
			lang="en"
			className="overflow-x-hidden bg-background text-on-background theme-[#6751a4]"
		>
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />

				<Meta />
				<Links />
			</head>
			<body className="">
				<SnackbarQueue>
					<Layout>
						<Outlet />
					</Layout>
				</SnackbarQueue>
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	)
}
