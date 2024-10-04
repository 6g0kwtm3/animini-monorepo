import { HydratedRouter as RemixBrowser } from "react-router/dom"

import { startTransition, StrictMode } from "react"
import { hydrateRoot } from "react-dom/client"

if (import.meta.env.MODE === "test") {
	const { worker } = await import("~/mocks/browser")
	await worker.start()
}

startTransition(() => {
	hydrateRoot(
		document,
		<StrictMode>
			<RemixBrowser />
		</StrictMode>
	)
})
