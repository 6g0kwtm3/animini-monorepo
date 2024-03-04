import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	json
} from "@remix-run/react"
import { LoaderArgs, LoaderLive } from "./lib/urql.server"

import { SnackbarQueue } from "./components/Snackbar"

import type { LinksFunction, LoaderFunction } from "@vercel/remix"

import { Effect, Option, pipe } from "effect"
import { Remix } from "./lib/Remix/index.server"
import tailwind from "./tailwind.css?url"

import type { ReactNode } from "react"
import { Layout as AppLayout } from "./components/Layout"
import { Viewer } from "./lib/Remix/Remix.server"

export const links: LinksFunction = () => {
	return [
		{
			rel: "stylesheet",
			href: tailwind
		},
		{ rel: "preconnect", href: "https://fonts.googleapis.com" },
		{
			rel: "preconnect",
			href: "https://fonts.gstatic.com",
			crossOrigin: "anonymous"
		},
		{
			rel: "stylesheet",
			href: "https://fonts.googleapis.com/css2?family=Noto+Sans:wght@100..900&display=swap"
		}
	]
}

export const loader = (async (args) => {
	return pipe(
		pipe(
			Effect.gen(function* (_) {
				const { request } = yield* _(LoaderArgs)
				const viewer = Option.getOrNull(yield* _(Viewer))
				return json(
					{ Viewer: viewer, language: request.headers.get("accept-language") },
					{
						headers: {
							"Cache-Control": "max-age=15, stale-while-revalidate=45, private"
						}
					}
				)
			})
		),
		Effect.provide(LoaderLive),
		Effect.provideService(LoaderArgs, args),
		Remix.runLoader
	)
}) satisfies LoaderFunction

export function Layout({ children }: { children: ReactNode }) {
	return (
		<html
			lang="en"
			className="theme-light bg-background font-['Noto_Sans',sans-serif] text-on-background palette-[#6751a4] dark:theme-dark supports-[(color:AccentColor)]:palette-[AccentColor]"
		>
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body>
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	)
}

export default function App() {
	return (
		<SnackbarQueue>
			<AppLayout
				navigation={{
					initial: "bar",
					sm: "rail",
					lg: "drawer"
				}}
			>
				<Outlet />
			</AppLayout>
		</SnackbarQueue>
	)
}
