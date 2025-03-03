import {
	isRouteErrorResponse,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLocation,
	useRevalidator,
	type LinksFunction,
	type ShouldRevalidateFunction,
} from "react-router"
import type { Route } from "./+types/root"
import { SnackbarQueue } from "./components/Snackbar"

import { createContext, useContext, useEffect, type ReactNode } from "react"
import { Card } from "./components/Card"
import { Ariakit } from "./lib/ariakit"

import theme from "~/../fallback.json"

import tailwind from "./tailwind.css?url"

import { M3 } from "~/lib/components"
import RelayEnvironment from "./lib/Network/components"
import { button } from "./lib/button"
import {
	assertIsLocale,
	baseLocale,
	defineGetLocale,
	isLocale,
} from "./paraglide/runtime"

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

export const clientLoader = (args: Route.ClientLoaderArgs) => {
	return {
		// 	// nonce: Buffer.from(crypto.randomUUID()).toString('base64'),
		language: args.request.headers.get("accept-language"),
		locale: isLocale(args.params.locale) ? args.params.locale : baseLocale,
	}
}

const LocaleContextSSR = createContext(baseLocale)
if (import.meta.env.SSR) {
	defineGetLocale(() => assertIsLocale(useContext(LocaleContextSSR)))
}

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
	// const { theme } = useLoaderData<typeof loader>()
	// const { locale, dir } = useLocale()
	// const { nonce } = useLoaderData()
	// setLanguageTag(locale)

	return (
		<html
			lang="en"
			// lang={locale}
			// dir={dir}
			style={theme}
			className="bg-background text-on-background contrast-standard theme-light contrast-more:contrast-high dark:theme-dark font-['Noto_Sans',sans-serif] scheme-light-dark"
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
				{import.meta.env.DEV && (
					<script
						crossOrigin="anonymous"
						src="//unpkg.com/react-scan/dist/auto.global.js"
					/>
				)}
				<Links />
			</head>
			<body>
				<RelayEnvironment>
					<SnackbarQueue>
						<Ariakit.HeadingLevel>{children}</Ariakit.HeadingLevel>
					</SnackbarQueue>
				</RelayEnvironment>

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

export default function App(props: Route.ComponentProps): ReactNode {
	return (
		<LocaleContextSSR.Provider value={props.loaderData.locale}>
			{import.meta.env.PROD && <RevalidateOnFocus />}
			<Outlet />
		</LocaleContextSSR.Provider>
	)
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps): ReactNode {
	let location = useLocation()

	// when true, this is what used to go to `CatchBoundary`
	if (isRouteErrorResponse(error)) {
		return (
			<div>
				<Ariakit.Heading>Oops</Ariakit.Heading>
				<p>Status: {error.status}</p>
				<p>{error.data}</p>
				<M3.Link to={location} className={button()}>
					Try again
				</M3.Link>
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
			<Ariakit.Heading className="text-headline-md text-balance">
				Uh oh ...
			</Ariakit.Heading>
			<p className="text-headline-sm">Something went wrong.</p>
			<pre className="text-body-md overflow-auto">{errorMessage}</pre>
			<M3.Link to={location} className={button()}>
				Try again
			</M3.Link>
		</Card>
	)
}

function RevalidateOnFocus() {
	const revalidator = useRevalidator()

	useOnFocus(() => {
		if (revalidator.state === "idle") {
			void revalidator.revalidate()
		}
	})

	return null
}
