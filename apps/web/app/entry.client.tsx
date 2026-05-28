import "virtual:react-router/unstable_rsc/inject-hmr-runtime"

import {
	createFromReadableStream,
	createTemporaryReferenceSet,
	encodeReply,
	setServerCallback,
} from "@vitejs/plugin-rsc/browser"
import { startTransition, StrictMode } from "react"
import { hydrateRoot, type ReactFormState } from "react-dom/client"
import {
	unstable_createCallServer as createCallServer,
	unstable_getRSCStream as getRSCStream,
	unstable_RSCHydratedRouter as RSCHydratedRouter,
	type unstable_RSCPayload as RSCPayload,
} from "react-router/dom"

import {
	graphqlClientIntegration,
	init,
	reactErrorHandler,
	reactRouterTracingIntegration,
	replayIntegration,
} from "@sentry/react"

import { API_URL } from "./lib/Network/environment"

const tracing = reactRouterTracingIntegration({ useInstrumentationAPI: true })

init({
	environment: import.meta.env.DEV
		? "development"
		: import.meta.env.CF_PAGES_BRANCH === "master"
			? `production`
			: "preview",
	dsn: "https://b72170d9bac5ee68ab3ce649b3aad356@o4508677510201344.ingest.de.sentry.io/4508677512888400",
	sendDefaultPii: true,
	integrations: [
		graphqlClientIntegration({ endpoints: [API_URL] }),
		tracing,
		replayIntegration(),
	],

	enableLogs: true,
	tracesSampleRate: 1.0, //  Capture 100% of the transactions

	// Set `tracePropagationTargets` to declare which URL(s) should have trace propagation enabled
	tracePropagationTargets: [/^\//, /^https:\/\/yourserver\.io\/api/],

	// Capture Replay for 10% of all sessions,
	// plus 100% of sessions with an error
	replaysSessionSampleRate: 0.1,
	replaysOnErrorSampleRate: 1.0,

	ignoreErrors: [`TypeError: Load failed`, `TypeError: Failed to fetch`],
})

setServerCallback(
	createCallServer({
		createFromReadableStream,
		createTemporaryReferenceSet,
		encodeReply,
	})
)

void createFromReadableStream<RSCPayload>(getRSCStream()).then((payload) => {
	startTransition(async () => {
		const formState =
			payload.type === "render"
				? ((await payload.formState) as ReactFormState)
				: undefined

		void hydrateRoot(
			document,
			<StrictMode>
				<RSCHydratedRouter
					instrumentations={[tracing.clientInstrumentation]}
					createFromReadableStream={createFromReadableStream}
					payload={payload}
				/>
			</StrictMode>,
			{
				formState,

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
})
