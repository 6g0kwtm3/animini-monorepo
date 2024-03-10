import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	isRouteErrorResponse,
	json,
	useRouteError
} from "@remix-run/react"
import { LoaderArgs, LoaderLive } from "./lib/urql.server"

import { SnackbarQueue } from "./components/Snackbar"

import type { LinksFunction, LoaderFunction } from "@vercel/remix"

import { Effect, Option, pipe } from "effect"
import { Remix } from "./lib/Remix/index.server"
import tailwind from "./tailwind.css?url"

import type { ReactNode } from "react"
import { Card } from "./components/Card"
import { Layout as AppLayout } from "./components/Layout"
import { Viewer } from "./lib/Remix/Remix.server"
import { useLocale } from "./lib/useLocale"
import { setLanguageTag } from "./paraglide/runtime"

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
					{
						Viewer: viewer,
						// nonce: Buffer.from(crypto.randomUUID()).toString('base64'),
						language: request.headers.get("accept-language")
					},
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

export function Layout({ children }: { children: ReactNode }): JSX.Element {
	const { locale, dir } = useLocale()
	// const { nonce } = useRawLoaderData<typeof loader>()

	setLanguageTag(locale)

	return (
		<html
			lang={locale}
			dir={dir}
			className="theme-light bg-background font-['Noto_Sans',sans-serif] text-on-background palette-[#6751a4] dark:theme-dark supports-[(color:AccentColor)]:palette-[AccentColor]"
		>
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				{/* <meta
					httpEquiv="Content-Security-Policy"
					content={`script-src 'strict-dynamic' 'nonce-${nonce}' 'unsafe-inline' http: https:;
 object-src 'none';
 base-uri 'none';
 require-trusted-types-for 'script';
 report-uri https://csp.example.com;`}
				/> */}
				<Meta />
				<Links />
			</head>
			<body>
				{children}
				<ScrollRestoration
				//  nonce={nonce}
				/>
				<Scripts
				// nonce={nonce}
				/>
			</body>
		</html>
	)
}

export default function App(): JSX.Element {
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

export function ErrorBoundary(): JSX.Element {
	const error = useRouteError()

	// when true, this is what used to go to `CatchBoundary`
	if (isRouteErrorResponse(error)) {
		return (
			<div>
				<h1>Oops</h1>
				<p>Status: {error.status}</p>
				<p>{error.data}</p>
			</div>
		)
	}

	// Don't forget to typecheck with your own logic.
	// Any value can be thrown, not just errors!
	let errorMessage = "Unknown error"
	if (error instanceof Error) {
		errorMessage = error.message || errorMessage
	}

	return (
		<Card
			variant="elevated"
			className="m-4 force:bg-error-container force:text-on-error-container"
		>
			<h1 className="text-balance text-headline-md">Uh oh ...</h1>
			<p className="text-headline-sm">Something went wrong.</p>
			<pre className="overflow-auto text-body-md">{errorMessage}</pre>
		</Card>
	)
}
