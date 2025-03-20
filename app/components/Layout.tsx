import type { ComponentProps, ComponentRef, ReactNode, RefObject } from "react"
import {
	createContext,
	use,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react"
import type { VariantProps } from "tailwind-variants"

import { match } from "arktype"
import { motion, motionValue, useMotionValue } from "motion/react"
import { tv } from "~/lib/tailwind-variants"
function mod(n, m) {
	return ((n % m) + m) % m
}
const createLayout = tv(
	{
		slots: {
			root: "isolate",
			body: "me-4 flex gap-6 sm:me-6",
		},
		variants: {
			navigation: {
				none: { body: "ms-4 pb-0 sm:ms-6" },
				bar: {
					root: "",
					body: "ms-4 pb-20 sm:ms-6",
				},
				rail: {
					root: "",
					body: "ms-20 pb-0 sm:ms-20",
				},
				drawer: {
					root: "",
					body: "ms-[22.5rem] pb-0 sm:ms-[22.5rem]",
				},
			},
		},
		defaultVariants: { navigation: "none" },
	},
	{ responsiveVariants: ["sm", "lg"] }
)

const LayoutContext = createContext(createLayout())
export function Layout({
	navigation,
	...props
}: ComponentProps<"div"> & VariantProps<typeof createLayout>): ReactNode {
	const styles = createLayout({ navigation })

	return (
		<LayoutNavigationContext value={navigation}>
			<LayoutContext.Provider value={styles}>
				<div className={styles.root({ className: props.className })}>
					{props.children}
				</div>
			</LayoutContext.Provider>
		</LayoutNavigationContext>
	)
}

export const LayoutNavigationContext =
	createContext<VariantProps<typeof createLayout>["navigation"]>("none")

export function LayoutBody(props: ComponentProps<"main">): ReactNode {
	const { body } = use(LayoutContext)
	const ref = useRef<HTMLElement>(null)
	return (
		<HandleBody value={ref}>
			<main
				{...props}
				ref={ref}
				className={body({ className: props.className })}
			/>
		</HandleBody>
	)
}

export const PaneContext = createContext<RefObject<ComponentRef<"div"> | null>>(
	{
		current: null,
	}
)

const pane = tv(
	{
		base: "relative block overflow-x-hidden overflow-y-auto rounded-md",
		variants: {
			variant: {
				fixed: "w-[22.5rem] shrink-0",
				flexible: "w-full flex-grow",
			},
			navigation: {
				none: "max-h-svh",
				bar: "max-h-[calc(100svh-5rem)]",
				rail: "max-h-svh",
				drawer: "max-h-svh",
			},
		},
		defaultVariants: { variant: "flexible" },
	},
	{
		responsiveVariants: ["sm", "lg"],
	}
)

export function LayoutPane({
	variant,
	...props
}: ComponentProps<typeof motion.section> &
	VariantProps<typeof pane>): ReactNode {
	const ref = useRef<ComponentRef<"div">>(null)
	const ctx = use(LayoutNavigationContext)

	const width = use(LayoutWidth)

	return (
		<PaneContext value={ref}>
			<motion.section
				{...props}
				ref={ref}
				style={{ width: width }}
				className={pane({
					className: props.className,
					variant,
					navigation: ctx,
				})}
			/>
		</PaneContext>
	)
}

const LayoutWidth = createContext(motionValue<number | undefined>(undefined))
const HandleBody = createContext<RefObject<HTMLElement | null>>({
	current: typeof document === "undefined" ? null : document.body,
})

const DEFAULT_SNAP_POINTS = (width: number) => [0, 360, 412, width / 2, width]

function findClosestIndex(value: number, points: number[]): number {
	for (let i = 1; i < points.length; i++) {
		if (Math.abs(value - points[i]) > Math.abs(value - points[i - 1])) {
			return i - 1
		}
	}
	return points.length - 1
}

function useEffectEvent<R>(fn: () => R) {
	const ref = useRef(fn)
	if (ref.current !== fn) {
		ref.current = fn
	}
	return useCallback(() => ref.current(), [])
}

export function LayoutHandle(props: {
	snapPoints?: (width: number) => number[]
	children: ReactNode
	className?: string
	initialValue: number
	onChange?: (index: number) => void
}) {
	const body = use(HandleBody)

	let [index, setIndex] = useState(props.initialValue)

	const getSnapPoints = useEffectEvent(() => {
		const rect = body.current?.getBoundingClientRect()
		if (!rect) {
			return
		}
		return (props.snapPoints ?? DEFAULT_SNAP_POINTS)(rect.width - 24)
	})

	const width = useMotionValue<number | undefined>(undefined)

	useEffect(() => {
		const snapPoints = getSnapPoints()
		if (typeof snapPoints?.[index] === "number") {
			width.set(snapPoints[index])
		}
	}, [getSnapPoints, index])

	let [pressed, setPressed] = useState(false)

	useEffect(() => {
		if (pressed) {
			let timeout = setTimeout(() => setPressed(false), 100)
			return () => clearTimeout(timeout)
		}
	}, [pressed])

	const isShiftDown = useRef(false)

	return (
		<>
			<div className="-ml-6 flex">
				<button
					type="button"
					onKeyDown={(e) => {
						let left = () =>
							setIndex((index) => {
								let snapPoints = getSnapPoints()
								if (snapPoints) {
									return Math.min(index + 1, snapPoints.length - 1)
								}
								return index
							})

						let right = () => setIndex((index) => Math.max(0, index - 1))

						match({
							"'ArrowLeft'": left,
							"'ArrowRight'": right,
							"'Enter'|' '": () => {
								if (isShiftDown.current) {
									return left()
								}
								return right()
							},
							"'Shift'": () => {
								isShiftDown.current = true
							},
							default: () => {},
						})(e.key)
					}}
					onKeyUp={(e) => {
						match({
							"'Shift'": () => {
								isShiftDown.current = false
							},
							default: () => {},
						})(e.key)
					}}
					onPointerDown={() => {
						const controller = new AbortController()
						console.log("pointer-down")
						document.addEventListener(
							"mousemove",
							(e) => {
								console.log("mouse-move")
								const rect = body.current?.getBoundingClientRect()
								if (!rect) {
									return
								}

								let input_start = rect.left //0
								let input_end = rect.right //window.innerWidth
								let output_start = rect.width - 24
								let output_end = 0

								let slope =
									(output_end - output_start) / (input_end - input_start)

								let output = output_start + slope * (e.clientX - input_start)
								width.set(Math.max(0, Math.min(output, rect.width - 24)))
							},
							controller
						)
						document.addEventListener(
							"mouseup",
							() => {
								controller.abort()

								const snapPoints = getSnapPoints()
								if (!snapPoints) {
									return
								}

								let currentWidth = width.get()

								let snapWidthIndex = findClosestIndex(currentWidth, snapPoints)
								let snapWidth = snapPoints[snapWidthIndex]
								if (typeof snapWidth != "number") {
									return
								}
								if (snapWidth != currentWidth) {
									setIndex(snapWidthIndex)
									width.set(snapWidth)
									props.onChange?.(snapWidthIndex)
								}
							},
							controller
						)
					}}
					className={
						"group flex h-full w-6 cursor-col-resize items-center justify-center" +
						(props.className ? " " + props.className : "")
					}
					data-active={pressed || undefined}
				>
					<div className="bg-outline text-inverse-on-surface group-hover:state-hover group-focused:state-focus group-pressed:state-pressed group-pressed:w-3 group-pressed:h-13 duration-sm ease-emphasized-accelerate group-pressed:bg-on-surface group-pressed:rounded-md h-12 w-1 rounded-full transition-all"></div>
				</button>
				<LayoutWidth value={width}>{props.children}</LayoutWidth>
			</div>
		</>
	)
}
