import { useEffect } from "react"
import {
  createContext as createMiddlewareContext,
  useNavigation,
} from "react-router"
import type { Route } from "../+types/root"

export const queue: AbortController[] = []

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
	queue.push(abortController)

	return next()
}

export function useSetupOnAbortNavigation() {
	const navigation = useNavigation()
	useEffect(() => {
		if (navigation.state === "idle") {
			while (queue[0] && queue[1]) {
				queue[0].abort()
				queue.shift()
			}
		}
	}, [navigation.state])
}
