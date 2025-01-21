import * as Sentry from "@sentry/react"
import { startTransition, StrictMode, useEffect } from "react"
import { hydrateRoot } from "react-dom/client"
import {
	createRoutesFromChildren,
	matchRoutes,
	useLocation,
	useNavigationType,
} from "react-router"
import { HydratedRouter } from "react-router/dom"

Sentry.init({
	dsn: "https://examplePublicKey@o0.ingest.sentry.io/0",
	integrations: [
		Sentry.reactRouterV7BrowserTracingIntegration({
			createRoutesFromChildren: createRoutesFromChildren,
			matchRoutes: matchRoutes,
			useEffect: useEffect,
			useLocation: useLocation,
			useNavigationType: useNavigationType,
		}),
		Sentry.replayIntegration(),
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
			onUncaughtError: Sentry.reactErrorHandler((error, errorInfo) => {
				console.warn("Uncaught error", error, errorInfo.componentStack)
			}),
			// Callback called when React catches an error in an ErrorBoundary.
			onCaughtError: Sentry.reactErrorHandler(),
			// Callback called when React automatically recovers from errors.
			onRecoverableError: Sentry.reactErrorHandler(),
		}
	)
})
