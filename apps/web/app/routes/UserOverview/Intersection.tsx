import { type ComponentRef, type ReactNode, useEffect, useRef } from "react"

interface IntersectionProps extends IntersectionObserverInit {
	onIntersect: () => void
	children?: ReactNode
}

export function Intersection(props: IntersectionProps) {
	const ref = useRef<ComponentRef<"div">>(null)
	const onIntersect = useRef(props.onIntersect)
	onIntersect.current = props.onIntersect
	const { root, rootMargin, threshold } = props

	useEffect(() => {
		const { current } = ref
		if (!current) return

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						onIntersect.current()
					}
				}
			},
			{ root, rootMargin, threshold }
		)

		observer.observe(current)
		return () => { observer.unobserve(current); }
	}, [root, rootMargin, threshold])

	return <div ref={ref}>{props.children}</div>
}
