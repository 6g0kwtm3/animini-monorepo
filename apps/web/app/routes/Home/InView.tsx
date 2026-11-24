import {
	createContext,
	Fragment,
	use,
	useEffectEvent,
	useLayoutEffect,
	useRef,
	useState,
	useTransition,
	type ComponentProps,
	type ComponentRef,
	type ReactNode,
} from "react"
function InView(props: {
	children: ReactNode
	onChange: (inView: boolean) => void
}) {
	const fragmentRef = useRef<ComponentRef<typeof Fragment>>(null)

	const onChange = useEffectEvent(props.onChange)

	useLayoutEffect(() => {
		const visibleElements = new Set()
		const observer = new IntersectionObserver((entries) => {
			entries.forEach((e) => {
				if (e.isIntersecting) {
					void visibleElements.add(e.target)
				} else {
					void visibleElements.delete(e.target)
				}
			})
			onChange(visibleElements.size !== 0)
		})
		const fragmentInstance = fragmentRef.current
		if (fragmentInstance) {
			fragmentInstance.observeUsing(observer)
			return () => {
				fragmentInstance.unobserveUsing(observer)
			}
		}
	}, [])

	return <Fragment ref={fragmentRef}>{props.children}</Fragment>
}

const InViewContext = createContext(false)
InViewContext.displayName = "InViewContext"

export function InViewIframe(props: Omit<ComponentProps<"iframe">, "loading">) {
	const inView = use(InViewContext)

	return (
		<iframe
			{...props}
			title={props.title}
			loading={inView ? "eager" : "lazy"}
		></iframe>
	)
}

export function InViewProvider(props: { children: ReactNode }) {
	const [inView, setInView] = useState(false)

	const [, startTransition] = useTransition()

	return (
		<InViewContext value={inView}>
			<InView
				onChange={(inView) => {
					startTransition(() => {
						setInView(inView)
					})
				}}
			>
				{props.children}
			</InView>
		</InViewContext>
	)
}
