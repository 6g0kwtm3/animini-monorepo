import { useSignal } from "@preact/signals-react"
import { Predicate } from "effect"
import type {
	ComponentPropsWithoutRef,
	ElementRef,
	PropsWithChildren
} from "react"
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useId,
	useRef,
	useState
} from "react"
import { BaseButton, type InvokeEvent } from "./Button"

type OnBeforeToggle = (this: HTMLElement, event: ToggleEvent) => void

const SnackbarQueueContext = createContext<OnBeforeToggle>(() => {
	console.warn("Snackbar is outside of SnackbarQueue")
})

export function SnackbarQueue(props: PropsWithChildren<{}>) {
	const queue = useSignal<HTMLElement[]>([])

	const add = useCallback<OnBeforeToggle>(
		function (event) {
			const state = queue.value.at(0) === this ? "open" : "closed"

			if (state === "closed" && event.newState === "open") {
				event.preventDefault()

				queue.value = queue.value.includes(this)
					? queue.value
					: [...queue.value, this]
				return
			}

			if (event.newState === "closed") {
				queue.value = queue.value.includes(this)
					? queue.value.filter((f) => f !== this)
					: queue.value
				return
			}

			return
		},
		[queue]
	)

	useEffect(() => {
		for (const element of queue.value) {
			element.showPopover()

			const timeout = Number(element.dataset["timeout"])

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
	}, [queue, queue.value])

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
}) {
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
		function onInvoke(this: HTMLElement, event: InvokeEvent) {
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
				className="mb-7 line-clamp-2 hidden min-h-[3rem] max-w-[calc(100%-2rem)] flex-wrap items-center gap-3 rounded-xs bg-inverse-surface p-4 text-body-md text-inverse-on-surface elevation-3 [&:popover-open]:flex"
			></div>
		</SnackbarContext.Provider>
	)
}

export function SnackbarAction(props: ComponentPropsWithoutRef<"button">) {
	const invoketarget = useContext(SnackbarContext)

	const [supportsPopover, setSupportsPopover] = useState(true)

	useEffect(() => {
		setSupportsPopover(HTMLElement.prototype.hasOwnProperty("popover"))
	}, [])

	return (
		<BaseButton
			type="button"
			{...props}
			{...(supportsPopover
				? {
						popovertargetaction: "hide",
						popovertarget: invoketarget
					}
				: {
						invokeaction: "hide",
						invoketarget
					})}
			className="-my-1 -me-2 rounded-[1.25rem] px-3 py-1 text-label-lg text-inverse-primary state-inverse-primary first:ms-auto hover:state-hover focus:state-focus"
		></BaseButton>
	)
}
