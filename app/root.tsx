import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	isRouteErrorResponse,
	useRouteError,
	type ClientLoaderFunctionArgs
} from "@remix-run/react"
import { LoaderArgs, LoaderLive } from "./lib/urql.server"
import { json } from "@vercel/remix"
import { SnackbarQueue } from "./components/Snackbar"

import type {
	LinksFunction,
	LoaderFunction,
	SerializeFrom
} from "@vercel/remix"

import { Effect, Option, pipe } from "effect"
import { Remix } from "./lib/Remix/index.server"

import { type ReactNode } from "react"
import { Card } from "./components/Card"
import { Viewer } from "./lib/Remix/Remix.server"
import { Ariakit } from "./lib/ariakit"

import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { ClientOnly } from "remix-utils/client-only"
import { client } from "./lib/cache.client"
import { getCacheControl } from "./lib/getCacheControl"
import { useLocale } from "./lib/useLocale"
import { setLanguageTag } from "./paraglide/runtime"
import tailwind from "./tailwind.css?url"

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

const cacheControl = {
	maxAge: 15,
	staleWhileRevalidate: 45,
	private: true
}

export async function clientLoader(
	args: ClientLoaderFunctionArgs
): Promise<SerializeFrom<typeof loader>> {
	return args.serverLoader<typeof loader>()
}
clientLoader.hydrate = true

export const loader = (async (args) => {
	return await pipe(
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
							"Cache-Control": getCacheControl(cacheControl)
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

export function Layout({ children }: { children: ReactNode }): ReactNode {
	const { locale, dir } = useLocale()
	// const { nonce } = useRawLoaderData()

	setLanguageTag(locale)

	return (
		<html
			lang={locale}
			dir={dir}
			className="theme-light select-none bg-background font-['Noto_Sans',sans-serif] text-on-background palette-[#6751a4] [color-scheme:light_dark] dark:theme-dark supports-[(color:AccentColor)]:palette-[AccentColor]"
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
				<Ariakit.HeadingLevel>{children}</Ariakit.HeadingLevel>
				<ClientOnly>
					{() => (
						<QueryClientProvider client={client}>
							<ReactQueryDevtools initialIsOpen={false} />
						</QueryClientProvider>
					)}
				</ClientOnly>
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

export default function App(): ReactNode {
	return (
		<SnackbarQueue>
			<Outlet />
		</SnackbarQueue>
	)
}

export function ErrorBoundary(): ReactNode {
	const error = useRouteError()

	// when true, this is what used to go to `CatchBoundary`
	if (isRouteErrorResponse(error)) {
		return (
			<div>
				<Ariakit.Heading>Oops</Ariakit.Heading>
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
			<Ariakit.Heading className="text-balance text-headline-md">
				Uh oh ...
			</Ariakit.Heading>
			<p className="text-headline-sm">Something went wrong.</p>
			<pre className="overflow-auto text-body-md">{errorMessage}</pre>
		</Card>
	)
}
