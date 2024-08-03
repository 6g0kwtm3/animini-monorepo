import { RemixBrowser } from "@remix-run/react"
import { startTransition, StrictMode } from "react"
import { hydrateRoot } from "react-dom/client"

if (import.meta.env.PROD) {
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
