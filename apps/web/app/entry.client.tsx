import {
	init,
	reactErrorHandler,
	reactRouterV7BrowserTracingIntegration,
	replayIntegration,
} from "@sentry/react"
import { startTransition, StrictMode, useEffect } from "react"
import { hydrateRoot } from "react-dom/client"
import {
	createRoutesFromChildren,
	matchRoutes,
	useLocation,
	useNavigationType,
} from "react-router"
import { HydratedRouter } from "react-router/dom"

init({
	environment: import.meta.env.DEV
		? "development"
		: import.meta.env.CF_PAGES_BRANCH === "master"
			? `production`
			: "preview",
	dsn: "https://b72170d9bac5ee68ab3ce649b3aad356@o4508677510201344.ingest.de.sentry.io/4508677512888400",
	integrations: [
		reactRouterV7BrowserTracingIntegration({
			createRoutesFromChildren: createRoutesFromChildren,
			matchRoutes: matchRoutes,
			useEffect: useEffect,
			useLocation: useLocation,
			useNavigationType: useNavigationType,
		}),
		replayIntegration(),
	],

	tracesSampleRate: 1.0, //  Capture 100% of the transactions

	// Set `tracePropagationTargets` to declare which URL(s) should have trace propagation enabled
	tracePropagationTargets: [/^\//, /^https:\/\/yourserver\.io\/api/],

	// Capture Replay for 10% of all sessions,
	// plus 100% of sessions with an error
	replaysSessionSampleRate: 0.1,
	replaysOnErrorSampleRate: 1.0,
})

startTransition(() => {
	hydrateRoot(
		document,
		<StrictMode>
			<HydratedRouter />
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
