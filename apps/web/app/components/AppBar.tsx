import * as Ariakit from "@ariakit/react"
import type { ComponentProps, ComponentRef, ReactNode } from "react"
import { createContext, useContext, useEffect, useRef, useState } from "react"
import type { VariantProps } from "tailwind-variants"

import { numberToString } from "~/lib/numberToString"
import { tv } from "~/lib/tailwind-variants"

const appBar = tv(
	{
		defaultVariants: {
			elevate: false,
			hide: false,
			position: "fixed",
			variant: "small",
		},
		slots: {
			root: "bg-surface flex gap-2",
			title: "text-title-lg text-on-surface flex h-10 items-center first:ms-2",
		},
		variants: {
			elevate: {
				false: {},
				true: { root: "data-[elevated='true']:bg-surface-container" },
			},
			hide: {
				false: { root: "" },
				true: {
					root: "data-[hidden='true']:-translate-y-(--app-bar-height) transform-gpu transition-transform ease-spatial duration-spatial sm:data-[hidden='true']:translate-y-0",
				},
			},
			variant: {
				centered: { root: "" },
				large: {
					root: "animate-app-bar-large h-28 px-2 pb-6 pt-3 [animation-range:0_7rem] [animation-timeline:scroll()]",
				},
				medium: { root: "" },
				small: { root: "h-16 px-2 pb-3 pt-3" },
			},
		},
	},
	{}
)

const AppBarContext = createContext(appBar())
interface AppBarProps
	extends ComponentProps<"nav">,
		VariantProps<typeof appBar> {}

export function AppBar({
	elevate,
	hide,
	variant,
	...props
}: AppBarProps): ReactNode {
	const [scrolled, setScrolled] = useState(0)
	const [hidden, setHidden] = useState(false)

	const ref = useRef<ComponentRef<"nav">>(null)

	const styles = appBar({ elevate, hide, variant })

	useEffect(() => {
		function listener() {
			setScrolled((scrollY) => {
				setHidden(scrollY < window.scrollY)
				return window.scrollY
			})
		}
		window.addEventListener("scroll", listener)
		return () => {
			window.removeEventListener("scroll", listener)
		}
	}, [])

	const observer = useRef(
		new ResizeObserver((nodes) => {
			for (const node of nodes) {
				if (node.target instanceof HTMLElement) {
					node.target.style.setProperty(
						"--app-bar-height",
						`${numberToString(node.target.clientHeight)}px`
					)
				}
			}
		})
	)

	useEffect(() => {
		const node = ref.current
		if (!node) return
		const observerCurrent = observer.current
		observerCurrent.observe(node)
		return () => {
			observerCurrent.unobserve(node)
		}
	}, [])

	return (
		<AppBarContext.Provider value={styles}>
			<nav
				{...props}
				className={styles.root({ className: props.className })}
				data-elevated={scrolled !== 0}
				data-hidden={hidden}
				ref={ref}
			/>
		</AppBarContext.Provider>
	)
}
export function AppBarTitle(props: Ariakit.HeadingProps): ReactNode {
	const styles = useContext(AppBarContext)
	return (
		<Ariakit.Heading
			{...props}
			className={styles.title({ className: props.className })}
		></Ariakit.Heading>
	)
}
