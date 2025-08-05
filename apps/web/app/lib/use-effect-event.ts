import { useCallback, useEffect, useRef } from "react"

export function useEffectEvent<Args extends unknown[], T extends unknown>(
	event: (...args: Args) => T
) {
	const ref = useRef(event)

	useEffect(() => {
		ref.current = event
	})

	return useCallback(
		(...args: Args): T => {
			return ref.current(...args)
		},
		[ref]
	)
}
