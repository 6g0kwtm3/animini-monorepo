import { useCallback, useEffect, useRef } from "react"

export function useEffectEvent<T extends Function>(event: T) {
	const ref = useRef<T>(event)

	useEffect(() => {
		ref.current = event
	})

	return useCallback(
		((...args: unknown[]) => {
			return ref.current(...args)
		}) as unknown as T,
		[ref]
	)
}
