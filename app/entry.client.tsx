import { HydratedRouter } from "react-router/dom"
import { startTransition, StrictMode } from "react"
import { hydrateRoot } from "react-dom/client"
import * as Sentry from "@sentry/react"

Sentry.init({
	dsn: "https://examplePublicKey@o0.ingest.sentry.io/0",
	integrations: [
		Sentry.browserTracingIntegration(),
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
		</StrictMode>
	)
})
