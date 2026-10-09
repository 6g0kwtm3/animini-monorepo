import {
	createSentryClientInstrumentation,
	graphqlClientIntegration,
	init,
	reactErrorHandler,
	reactRouterTracingIntegration,
	replayIntegration,
	consoleLoggingIntegration,
	openFeatureIntegration,
} from "@sentry/react"
import { startTransition, StrictMode } from "react"
import { hydrateRoot } from "react-dom/client"
import { generatePath, matchPath } from "react-router"
import { HydratedRouter } from "react-router/dom"

import { API_URL } from "./lib/Network/environment"
import { scrubPathname } from "./lib/scrub"

init({
	environment:
		import.meta.env.VITE_SENTRY_MODE === "production"
		|| import.meta.env.VITE_SENTRY_MODE === "preview"
		|| import.meta.env.VITE_SENTRY_MODE === "e2e"
			? import.meta.env.VITE_SENTRY_MODE
			: "development",
	dsn: "https://b72170d9bac5ee68ab3ce649b3aad356@o4508677510201344.ingest.de.sentry.io/4508677512888400",
	beforeBreadcrumb(breadcrumb) {
		if (breadcrumb.data == null) {
			return breadcrumb
		}
		if (typeof breadcrumb.data.from === "string") {
			breadcrumb.data.from = scrubPathname(breadcrumb.data.from)
		}
		if (typeof breadcrumb.data.to === "string") {
			breadcrumb.data.to = scrubPathname(breadcrumb.data.to)
		}

		return breadcrumb
	},
	beforeSend(event) {
		if (event.transaction != null) {
			event.transaction = scrubPathname(event.transaction)
		}
		if (event.request?.url != null && URL.canParse(event.request.url)) {
			const url = new URL(event.request.url)
			url.pathname = scrubPathname(url.pathname)
			event.request.url = url.toString()
		}
		return event
	},
	beforeSendSpan(span) {
		if (typeof span.attributes["url.path"] === "string") {
			span.attributes["url.path"] = scrubPathname(span.attributes["url.path"])
		}

		if (
			typeof span.attributes["url.full"] === "string"
			&& URL.canParse(span.attributes["url.full"])
		) {
			const url = new URL(span.attributes["url.full"])
			url.pathname = scrubPathname(url.pathname)
			span.attributes["url.full"] = url.toString()
		}

		return span
	},

	dataCollection: {
		userInfo: false,
		httpHeaders: { deny: ["forwarded", "-ip", "remote-", "via", "-user"] },
		cookies: { deny: ["forwarded", "-ip", "remote-", "via", "-user"] },
		urlQueryParams: { deny: ["forwarded", "-ip", "remote-", "via", "-user"] },
	},

	integrations: [
		openFeatureIntegration(),
		consoleLoggingIntegration(),
		graphqlClientIntegration({ endpoints: [API_URL] }),
		reactRouterTracingIntegration(),
		replayIntegration(),
	],

	tracesSampleRate: 1.0, //  Capture 100% of the transactions

	// Set `tracePropagationTargets` to declare which URL(s) should have trace propagation enabled
	tracePropagationTargets: [/^\//, /^https:\/\/yourserver\.io\/api/],

	// Capture Replay for 10% of all sessions,
	// plus 100% of sessions with an error
	replaysSessionSampleRate: 0.1,
	replaysOnErrorSampleRate: 1.0,

	ignoreErrors: [
		`TypeError: NetworkError when attempting to fetch resource`,
		`TypeError: Load failed`,
		`TypeError: Failed to fetch`,
	],
})

startTransition(() => {
	void hydrateRoot(
		document,
		<StrictMode>
			<HydratedRouter
				instrumentations={[createSentryClientInstrumentation()]}
			/>
		</StrictMode>,
		{
			// Callback called when an error is thrown and not caught by an ErrorBoundary.
			onUncaughtError: reactErrorHandler((error, errorInfo) => {
				console.warn("Uncaught error", error, errorInfo.componentStack)
			}),
			// Callback called when React catches an error in an ErrorBoundary.
			onCaughtError: reactErrorHandler(),
			// Callback called when React automatically recovers from errors.
			onRecoverableError: reactErrorHandler(),
		}
	)
})
