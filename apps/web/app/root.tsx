import { captureException, startSpan } from "@sentry/react"
import {
	isRouteErrorResponse,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useRouteError,
	type ClientLoaderFunctionArgs,
	type LinksFunction,
	type ShouldRevalidateFunction,
} from "react-router"
import { SnackbarQueue } from "./components/Snackbar"

import * as Ariakit from "@ariakit/react"
import { type ReactNode } from "react"
import { Card } from "./components/Card"
import { Viewer } from "./lib/Remix"

import theme from "~/../fallback.json"

import tailwind from "./tailwind.css?url"

import { useSentryToolbar } from "@sentry/toolbar"
import type { IEnvironment } from "relay-runtime"
import { useIsHydrated } from "~/lib/useIsHydrated"
import type { Route } from "./+types/root"
import environment, {
	loadQueryMiddleware,
	RelayEnvironmentProvider,
} from "./lib/Network"

const RelayEnvironment = RelayEnvironmentProvider as (props: {
	children: ReactNode
	environment: IEnvironment
}) => ReactNode

export const links: LinksFunction = () => {
	return [
		{ rel: "stylesheet", href: tailwind },
		{ rel: "preconnect", href: "https://fonts.googleapis.com" },
		{
			rel: "preconnect",
			href: "https://fonts.gstatic.com",
			crossOrigin: "anonymous",
		},
		{
			rel: "stylesheet",
			href: "https://fonts.googleapis.com/css2?family=Noto+Sans:wght@100..900&display=swap",
		},
	]
}

export const clientLoader = (args: ClientLoaderFunctionArgs) => {
	const viewer = Viewer()

	return {
		Viewer: viewer,
		// nonce: Buffer.from(crypto.randomUUID()).toString('base64'),
		language: args.request.headers.get("accept-language"),
	}
}

export const shouldRevalidate: ShouldRevalidateFunction = ({
	formAction,
	defaultShouldRevalidate,
}) => {
	return (
		formAction === "/login"
		|| formAction === "/logout"
		|| defaultShouldRevalidate
	)
}

function SentryToolbar() {
	useSentryToolbar({
		initProps: {
			organizationSlug: "animini",
			projectIdOrSlug: "javascript-react",
		},
	})
	return null
}

export function Layout({ children }: { children: ReactNode }): ReactNode {
	// const { theme } = useRawLoaderData<typeof loader>()
	// const { locale, dir } = useLocale()
	// const { nonce } = useRawLoaderData()
	// setLanguageTag(locale)

	const isHydrated = useIsHydrated()

	return (
		<html
			lang="en"
			// lang={locale}
			// dir={dir}
			style={theme}
			data-testid={isHydrated && "hydrated"}
			className="bg-background text-on-background contrast-standard theme-light contrast-more:contrast-high dark:theme-dark font-['Noto_Sans',sans-serif] [color-scheme:light_dark]"
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
				{import.meta.env.DEV && (
					<script
						async
						src="https://unpkg.com/react-scan/dist/auto.global.js"
					></script>
				)}
			</head>
			<body>
				<RelayEnvironment environment={environment}>
					<SnackbarQueue>
						<Ariakit.HeadingLevel>{children}</Ariakit.HeadingLevel>
					</SnackbarQueue>
				</RelayEnvironment>
				{/* {import.meta.env.DEV && <SentryToolbar></SentryToolbar>} */}
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

const clientLoggerMiddleware: Route.unstable_ClientMiddlewareFunction = (
	{ request },
	next
) => {
	return startSpan({ name: `Navigated to ${request.url}` }, () => {
		// Run the remaining middlewares and all route loaders
		return next()
	})
}

export const unstable_clientMiddleware = [
	clientLoggerMiddleware,
	loadQueryMiddleware,
]

export default function App(): ReactNode {
	return <Outlet />
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
	captureException(error)
	// Don't forget to typecheck with your own logic.
	// Any value can be thrown, not just errors!
	let errorMessage = "Unknown error"
	if (error instanceof Error) {
		errorMessage = error.message || errorMessage
	}

	return (
		<Card
			variant="elevated"
			className="bg-error-container text-on-error-container m-4"
		>
			<Ariakit.Heading className="text-headline-md text-balance">
				Uh oh ...
			</Ariakit.Heading>
			<p className="text-headline-sm">Something went wrong.</p>
			<pre className="text-body-md overflow-auto">{errorMessage}</pre>
		</Card>
	)
}
