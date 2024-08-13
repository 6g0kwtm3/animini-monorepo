import {
	isRouteErrorResponse,
	Link,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	unstable_defineClientLoader,
	useLocation,
	useRevalidator,
	useRouteError,
	type ShouldRevalidateFunction,
} from "@remix-run/react"
import { SnackbarQueue } from "./components/Snackbar"

import { type LinksFunction } from "@remix-run/node"

import { useEffect, useState, type ReactNode } from "react"
import { Card } from "./components/Card"
import { Ariakit } from "./lib/ariakit"

import theme from "~/../fallback.json"

import tailwind from "./tailwind.css?url"

import environment, { commitLocalUpdate, loadQuery } from "./lib/Network"
import { RelayEnvironmentProvider } from "./lib/Network/components"
import { button } from "./lib/button"

import type { rootQuery } from "~/gql/rootQuery.graphql"

import ReactRelay from "react-relay"

const { graphql } = ReactRelay

export const links: LinksFunction = () => {
	return [
		{
			rel: "stylesheet",
			href: tailwind,
		},
		{ rel: "preconnect", href: "https://fonts.googleapis.com" },
		{
			rel: "preconnect",
			href: "https://fonts.gstatic.com",
			crossOrigin: "anonymous",
		},
		{
			rel: "stylesheet",
			href: "https://fonts.googleapis.com/css2?family=Noto+Sans:wght@100..900&family=Noto+Sans+Mono&display=swap",
		},
		{
			rel: "dns-prefetch",
			href: "https://graphql.anilist.co",
		},
	]
}

const RootQuery = graphql`
	query rootQuery @raw_response_type {
		Viewer {
			id
			name
			unreadNotificationCount
		}
	}
`

export const clientLoader = unstable_defineClientLoader(async (args) => {
	const query = loadQuery<rootQuery>(RootQuery, {})

	return {
		RootQuery: query,
		// 	// nonce: Buffer.from(crypto.randomUUID()).toString('base64'),
		language: args.request.headers.get("accept-language"),
	}
})

export const shouldRevalidate: ShouldRevalidateFunction = ({
	formAction,
	defaultShouldRevalidate,
}) => {
	return (
		formAction === "/login" ||
		formAction === "/logout" ||
		defaultShouldRevalidate
	)
}

export function Layout({ children }: { children: ReactNode }): ReactNode {
	// const { theme } = useRawLoaderData<typeof loader>()
	// const { locale, dir } = useLocale()
	// const { nonce } = useRawLoaderData()
	// setLanguageTag(locale)

	return (
		<html
			lang="en"
			// lang={locale}
			// dir={dir}
			style={theme}
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
				<RelayEnvironmentProvider environment={environment}>
					<SnackbarQueue>
						<Ariakit.HeadingLevel>{children}</Ariakit.HeadingLevel>
					</SnackbarQueue>
				</RelayEnvironmentProvider>

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
	return (
		<>
			{import.meta.env.PROD && <RevalidateOnFocus />}
			<Outlet />
		</>
	)
}

export function ErrorBoundary(): ReactNode {
	const error = useRouteError()
	let location = useLocation()

	// when true, this is what used to go to `CatchBoundary`
	if (isRouteErrorResponse(error)) {
		return (
			<div>
				<Ariakit.Heading>Oops</Ariakit.Heading>
				<p>Status: {error.status}</p>
				<p>{error.data}</p>
				<Link to={location} className={button()}>
					Try again
				</Link>
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
		<Card variant="elevated">
			<Ariakit.Heading className="text-balance text-headline-md">
				Uh oh ...
			</Ariakit.Heading>
			<p className="text-headline-sm">Something went wrong.</p>
			<pre className="overflow-auto text-body-md">{errorMessage}</pre>
			<Link to={location} className={button()}>
				Try again
			</Link>
		</Card>
	)
}

function RevalidateOnFocus() {
	const revalidator = useRevalidator()
	const TIMEOUT = 3 * 60_000 //3min
	const [, setTimeout] = useState(Date.now() + TIMEOUT)

	useOnFocus(() => {
		setTimeout((timeout) => {
			if (timeout > Date.now() || revalidator.state !== "idle") {
				return timeout
			}

			commitLocalUpdate((store) => {
				store.invalidateStore()
			})
			revalidator.revalidate()

			return Date.now() + TIMEOUT
		})
	})

	return null
}
