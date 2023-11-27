import type { Handle } from "@sveltejs/kit"
import { getClient } from "./lib/urql"

export const handle: Handle = ({ event, resolve }) => {
	event.locals.client = getClient(event.request)

	return resolve(event, {
		filterSerializedResponseHeaders: (name) => true,
	})
}
