import {
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	isRouteErrorResponse,
	unstable_defineClientLoader,
	useRouteError,
	type ShouldRevalidateFunction
} from "@remix-run/react"
import { SnackbarQueue } from "./components/Snackbar"
import { LoaderArgs, LoaderLive } from "./lib/urql.server"

import {
	unstable_defineLoader,
	type LinksFunction
} from "@remix-run/cloudflare"

import { Effect, Option, pipe } from "effect"
import { Remix } from "./lib/Remix/index.server"

import { useEffect, useSyncExternalStore, type ReactNode } from "react"
import { Card } from "./components/Card"
import { Viewer } from "./lib/Remix/Remix.server"
import { Ariakit } from "./lib/ariakit"

import theme from "~/../fallback.json"

import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { ClientOnly } from "remix-utils/client-only"
import { client } from "./lib/cache.client"
import { getCacheControl } from "./lib/getCacheControl"
import { useLocale } from "./lib/useLocale"
import { setLanguageTag } from "./paraglide/runtime"
import tailwind from "./tailwind.css?url"

import { useRevalidator } from "@remix-run/react"

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

export const clientLoader = unstable_defineClientLoader(async (args) =>
	args.serverLoader<typeof loader>()
)
clientLoader.hydrate = true

export const loader = unstable_defineLoader(async (args) => {
	return pipe(
		Effect.gen(function* () {
			const { request } = yield* LoaderArgs
			const viewer = Option.getOrNull(yield* Viewer)

			args.response?.headers.append(
				"Cache-Control",
				getCacheControl(cacheControl)
			)

			args.response?.headers.append(
				"Cache-Control",
				getCacheControl(cacheControl)
			)

			return {
				Viewer: viewer,
				// nonce: Buffer.from(crypto.randomUUID()).toString('base64'),
				language: request.headers.get("accept-language")
			}
		}),
		Effect.provide(LoaderLive),
		Effect.provideService(LoaderArgs, args),
		Remix.runLoader
	)
})

export const shouldRevalidate: ShouldRevalidateFunction = ({
	formAction,
	defaultShouldRevalidate
}) => {
	return (
		formAction === "/login" ||
		formAction === "/logout" ||
		defaultShouldRevalidate
	)
}

export function Layout({ children }: { children: ReactNode }): ReactNode {
	const { locale, dir } = useLocale()
	// const { nonce } = useRawLoaderData()
	setLanguageTag(locale)

	const isHydrated = useSyncExternalStore(
		() => () => {},
		() => false,
		() => true
	)

	return (
		<html
			lang={locale}
			dir={dir}
			style={theme}
			data-testid={isHydrated && "hydrated"}
			className="bg-background font-['Noto_Sans',sans-serif] text-on-background contrast-standard theme-light [color-scheme:light_dark] contrast-more:contrast-high dark:theme-dark"
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

function useOnFocus(callback: () => void) {
	useEffect(() => {
		const onFocus = () => callback()
		window.addEventListener("focus", onFocus)
		return () => window.removeEventListener("focus", onFocus)
	}, [callback])
}

export default function App(): ReactNode {
	const revalidator = useRevalidator()

	useOnFocus(() => revalidator.revalidate())

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
