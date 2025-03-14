import type { ComponentPropsWithoutRef, ComponentRef, ReactNode } from "react"
import { createContext, useContext, useEffect, useRef, useState } from "react"
import type { VariantProps } from "tailwind-variants"
import { Ariakit } from "~/lib/ariakit"
import { createElement } from "~/lib/createElement"

import { tv } from "~/lib/tailwind-variants"

const appBar = tv(
	{
		slots: {
			root: "bg-surface flex gap-2",
			title: "text-title-lg text-on-surface flex h-10 items-center first:ms-2",
		},
		variants: {
			elevate: {
				true: { root: "data-[elevated='true']:bg-surface-container" },
				false: {},
			},
			hide: {
				true: {
					root: "data-[hidden='true']:-translate-y-(--app-bar-height) transform-gpu transition-transform sm:data-[hidden='true']:translate-y-0",
				},
				false: { root: "" },
			},
			variant: {
				centered: {
					root: "",
				},
				small: {
					root: "h-16 px-2 pb-3 pt-3",
				},
				medium: {
					root: "",
				},
				large: {
					root: "animate-app-bar-large h-28 px-2 pb-6 pt-3 [animation-range:0_7rem] [animation-timeline:scroll()]",
				},
			},
		},
		defaultVariants: {
			variant: "small",
			elevate: false,
			hide: false,
			position: "fixed",
		},
	},
	{}
)

const AppBarContext = createContext(appBar())
export function AppBar({
	variant,
	elevate,
	hide,

	...props
}: ComponentPropsWithoutRef<"nav"> & VariantProps<typeof appBar>): ReactNode {
	const [scrolled, setScrolled] = useState(0)
	const [hidden, setHidden] = useState(false)

	const ref = useRef<ComponentRef<"nav">>(undefined)

	const styles = appBar({
		variant,
		elevate,
		hide,
	})

	useEffect(() => {
		function listener() {
			setScrolled((scrollY) => {
				setHidden(scrollY < window.scrollY)
				return window.scrollY
			})
		}
		window.addEventListener("scroll", listener)
		return () => window.removeEventListener("scroll", listener)
	}, [])

	const observer = useRef(
		new ResizeObserver((nodes) => {
			for (const node of nodes) {
				if (node.target instanceof HTMLElement) {
					node.target.style.setProperty(
						"--app-bar-height",
						`${String(node.target.clientHeight)}px`
					)
				}
			}
		})
	)

	useEffect(() => {
		const node = ref.current
		if (!node) return
		let observerCurrent = observer.current
		observerCurrent.observe(node)
		return () => {
			observerCurrent.unobserve(node)
		}
	}, [])

	return (
		<AppBarContext.Provider value={styles}>
			<nav
				{...props}
				ref={ref}
				data-hidden={hidden}
				data-elevated={scrolled !== 0}
				className={styles.root({ className: props.className })}
			/>
		</AppBarContext.Provider>
	)
}
export function AppBarTitle(props: Ariakit.HeadingProps): ReactNode {
	const styles = useContext(AppBarContext)
	return createElement(Ariakit.Heading, {
		...props,
		className: styles.title({ className: props.className }),
	})
}
