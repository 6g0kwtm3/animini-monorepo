import { useCallback, useEffect, useRef } from "react"

export function useEffectEvent<Fn extends (...args: any[]) => any>(
	callback: Fn
) {
	const ref = useRef<Fn>(callback)

	useEffect(() => {
		ref.current = callback
	})

	return useCallback(
		(...args: Parameters<Fn>): ReturnType<Fn> => {
			return ref.current(...args)
		},
		[ref]
	)
}
