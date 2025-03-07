import type {
	ComponentPropsWithoutRef,
	ElementRef,
	PropsWithChildren,
	ReactNode,
} from "react"
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useId,
	useRef,
	useState,
} from "react"
import * as Predicate from "~/lib/Predicate"
import { BaseButton } from "./Button"

type OnBeforeToggle = (
	this: HTMLElement,
	event: HTMLElementEventMap["beforetoggle"]
) => void

const SnackbarQueueContext = createContext<OnBeforeToggle>(() => {
	console.warn("Snackbar is outside of SnackbarQueue")
})
export function SnackbarQueue(props: PropsWithChildren<{}>): ReactNode {
	const queue = useRef<HTMLElement[]>([])

	const add = useCallback<OnBeforeToggle>(
		function (event) {
			const state = queue.current.at(0) === this ? "open" : "closed"

			if (
				state === "closed" &&
				"newState" in event &&
				event.newState === "open"
			) {
				event.preventDefault()

				queue.current = queue.current.includes(this)
					? queue.current
					: [...queue.current, this]
				return
			}

			if ("newState" in event && event.newState === "closed") {
				queue.current = queue.current.includes(this)
					? queue.current.filter((f) => f !== this)
					: queue.current
				return
			}

			return
		},
		[queue]
	)

	useEffect(() => {
		for (const element of queue.current) {
			element.showPopover()

			const timeout = Number(element.dataset.timeout)

			if (!Number.isFinite(timeout)) {
				return
			}

			const timeoutId = setTimeout(() => {
				element.hidePopover()
			}, timeout)

			return () => {
				clearTimeout(timeoutId)
			}
		}
	}, [queue])

	return (
		<SnackbarQueueContext.Provider value={add}>
			{props.children}
		</SnackbarQueueContext.Provider>
	)
}

const SnackbarContext = createContext<string | undefined>(undefined)
export function Snackbar({
	timeout,
	open,
	...props
}: ComponentPropsWithoutRef<"div"> & {
	timeout?: number
	open: boolean
}): ReactNode {
	const ref = useRef<ElementRef<"div">>(null)
	const onBeforeToggle = useContext(SnackbarQueueContext)

	useEffect(() => {
		if (open) {
			ref.current?.showPopover()
		} else {
			ref.current?.hidePopover()
		}
	}, [open])

	useEffect(() => {
		const { current } = ref
		if (!current) {
			return
		}

		function onInvoke(this: HTMLElement, event: Event | ToggleEvent) {
			if (!isInvokeEvent(event)) {
				return
			}

			if (
				(event.action === "show" || event.action === "auto") &&
				!this.matches(":popover-open")
			) {
				this.showPopover()
				return
			}

			if (
				(event.action === "hide" || event.action === "auto") &&
				this.matches(":popover-open")
			) {
				this.hidePopover()
			}
		}
		current.addEventListener("invoke", onInvoke)

		return () => current.removeEventListener("invoke", onInvoke)
	}, [])

	useEffect(() => {
		const { current } = ref
		if (!current) {
			return
		}

		current.addEventListener("beforetoggle", onBeforeToggle)
		return () => current.removeEventListener("beforetoggle", onBeforeToggle)
	}, [onBeforeToggle])

	const id = useId()

	useEffect(() => {
		if (!Predicate.isNumber(timeout)) {
			return
		}
		if (4000 <= timeout && timeout <= 10_000) {
			return
		}
		console.warn(`Recommeneded <Snackbar /> timeout is between 4s and 10s`)
	}, [timeout])

	return (
		<SnackbarContext.Provider value={props.id ?? id}>
			<div
				{...props}
				id={props.id ?? id}
				role="alert"
				aria-live="assertive"
				popover="manual"
				data-timeout={timeout}
				ref={ref}
				className="mb-7 line-clamp-2 hidden min-h-[3rem] max-w-[calc(100%-2rem)] flex-wrap items-center gap-3 rounded-xs bg-inverse-surface p-4 text-body-md text-inverse-on-surface shadow-sm [&:popover-open]:flex"
			/>
		</SnackbarContext.Provider>
	)
}

interface ToggleEvent extends Event {
	action: string
}

function isInvokeEvent(event: Event | ToggleEvent) {
	return "action" in event
}

export function SnackbarAction(
	props: ComponentPropsWithoutRef<"button">
): ReactNode {
	const invoketarget = useContext(SnackbarContext)

	const [supportsPopover, setSupportsPopover] = useState(true)

	useEffect(() => {
		setSupportsPopover(
			Object.prototype.hasOwnProperty.call(HTMLElement.prototype, "popover")
		)
	}, [])

	return (
		<BaseButton
			type="button"
			{...props}
			{...(supportsPopover
				? {
						popovertargetaction: "hide",
						popovertarget: invoketarget,
					}
				: {
						invokeaction: "hide",
						invoketarget,
					})}
			className="-my-1 -me-2 rounded-[1.25rem] px-3 py-1 text-label-lg text-inverse-primary hover:state-hover focus:state-focus"
		/>
	)
}
