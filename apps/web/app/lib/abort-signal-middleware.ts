import { useEffect } from "react"
import {
	createContext as createMiddlewareContext,
	useNavigation,
} from "react-router"
import type { Route } from "../+types/root"

const queue = new Set<AbortController>()

export const onAbortNavigationSignal = createMiddlewareContext<AbortSignal>()

export const onAbortNavigationMiddleware: Route.MiddlewareFunction = (
	{ context, request },
	next
) => {
	const abortController = new AbortController()
	context.set(
		onAbortNavigationSignal,
		AbortSignal.any([request.signal, abortController.signal])
	)
	request.signal.addEventListener(
		"abort",
		() => {
			void queue.delete(abortController)
		},
		{ once: true }
	)
	void queue.add(abortController)

	return next()
}

export function useSetupOnAbortNavigation() {
	const navigation = useNavigation()
	useEffect(() => {
		if (navigation.state === "idle") {
			while (queue.size > 1) {
				for (const controller of queue) {
					controller.abort()
					void queue.delete(controller)
					break
				}
			}
		}
	}, [navigation.state])
}
