import { useEffect } from "react"
import {
	createContext as createMiddlewareContext,
	useNavigation,
} from "react-router"
import type { Route } from "../+types/root"

const queue = new Set<{ controller: AbortController; url: URL }>()

export const onAbortNavigationSignal = createMiddlewareContext<AbortSignal>()

export const onAbortNavigationMiddleware: Route.MiddlewareFunction = (
	{ context, request },
	next
) => {
	const controller = new AbortController()
	context.set(
		onAbortNavigationSignal,
		AbortSignal.any([request.signal, controller.signal])
	)
	const token = { controller, url: request.url }
	request.signal.addEventListener(
		"abort",
		() => {
			console.log("react-router aborted navigation", token.url)
			void queue.delete(token)
		},
		{ once: true }
	)
	console.log("added navigation", token.url)
	void queue.add(token)

	return next()
}

export function useSetupOnAbortNavigation() {
	const navigation = useNavigation()
	useEffect(() => {
		console.log(queue.size)
		if (navigation.state === "idle") {
			while (queue.size > 1) {
				for (const token of queue) {
					token.controller.abort()
					console.log("aborted stale navigation", token.url)
					void queue.delete(token)
					break
				}
			}
		}
	}, [navigation.state])
}
