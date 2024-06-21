import {
	isRouteErrorResponse,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	unstable_defineClientLoader,
	useRouteError,
	type ShouldRevalidateFunction,
} from "@remix-run/react"
import { SnackbarQueue } from "./components/Snackbar"

import { type LinksFunction } from "@remix-run/node"

import { Option } from "effect"

import {
	useEffect,
	useState,
	type FC,
	type ReactNode
} from "react"
import { Card } from "./components/Card"
import { Viewer } from "./lib/Remix"
import { Ariakit } from "./lib/ariakit"

import fallbackTheme from "~/../fallback.json"

import tailwind from "./tailwind.css?url"

import { useRevalidator } from "@remix-run/react"
import type { Environment } from "react-relay"
import { useIsHydrated } from "~/lib/useIsHydrated"
import environment, {
	RelayEnvironmentProvider as RelayEnvironmentProvider_,
} from "./lib/Network"
import { getThemeFromHex } from "./lib/theme"

const RelayEnvironmentProvider = RelayEnvironmentProvider_ as unknown as FC<{
	environment: Environment
	children?: ReactNode
}>

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
			href: "https://fonts.googleapis.com/css2?family=Noto+Sans:wght@100..900&display=swap",
		},
	]
}

export const clientLoader = unstable_defineClientLoader(async (args) => {
	const viewer = Option.getOrNull(Viewer())

	return {
		Viewer: viewer,
		// nonce: Buffer.from(crypto.randomUUID()).toString('base64'),
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

const rgba2hex = (rgba: string) => {
	const match = rgba.match(
		/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.{0,1}\d*))?\)$/
	)
	if (!match) return null

	return `#${match
		.slice(1)
		.map((n, i) =>
			(i === 3 ? Math.round(parseFloat(n) * 255) : parseFloat(n))
				.toString(16)
				.padStart(2, "0")
				.replace("NaN", "")
		)
		.join("")}`
}

const getAccentColorTheme = () => {
	const div = globalThis.document.createElement("div")
	globalThis.document.body.appendChild(div)
	div.style.setProperty("background", "AccentColor")
	const AccentColor = globalThis.window
		.getComputedStyle(div)
		.getPropertyValue("background-color")
	globalThis.document.body.removeChild(div)

	const hexed = rgba2hex(AccentColor)

	if (hexed?.match(/#0+/)) {
		return null
	}

	return hexed ? getThemeFromHex(hexed) : null
}

export function Layout({ children }: { children: ReactNode }): ReactNode {
	// const { theme } = useRawLoaderData<typeof loader>()
	// const { locale, dir } = useLocale()
	// const { nonce } = useRawLoaderData()
	// setLanguageTag(locale)

	const isHydrated = useIsHydrated()

	const [theme, setTheme] = useState<{
		[key: string]: string
	}>(fallbackTheme)

	useEffect(() => {
		const theme = getAccentColorTheme()
		if (theme) setTheme(theme)
	}, [])

	return (
		<html
			// lang={locale}
			// dir={dir}
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
	const revalidator = useRevalidator()

	useOnFocus(() => {
		if (revalidator.state === "idle") {
			revalidator.revalidate()
		}
	})

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
