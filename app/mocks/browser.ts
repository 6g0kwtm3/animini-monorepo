import { setupWorker } from "msw/browser"
import * as handlers from "./handlers"

export const worker = setupWorker(...handlers.handlers)

declare global {
	interface Window {
		worker: typeof worker
		handlers: typeof handlers
	}
}

window.worker = worker
window.handlers = handlers
