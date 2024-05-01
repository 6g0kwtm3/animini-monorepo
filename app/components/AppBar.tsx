import type { ComponentPropsWithoutRef, ElementRef, ReactNode } from "react"
import { createContext, useContext, useEffect, useRef, useState } from "react"
import type { VariantProps } from "tailwind-variants"
import { createTV } from "tailwind-variants"
import { Ariakit } from "~/lib/ariakit"
import { createElement } from "~/lib/createElement"

const tv = createTV({ twMerge: false })

const appBar = tv(
	{
		slots: {
			root: "flex gap-2 bg-surface",
			title: "flex h-10 items-center text-title-lg text-on-surface first:ms-2"
		},
		variants: {
			elevate: {
				true: { root: "data-[elevated='true']:bg-surface-container" },
				false: {}
			},
			hide: {
				true: {
					root: "transform-gpu transition-transform data-[hidden='true']:-translate-y-[--app-bar-height] sm:data-[hidden='true']:translate-y-0"
				},
				false: { root: "" }
			},
			variant: {
				centered: {
					root: ""
				},
				small: {
					root: "h-16 px-2 pb-3 pt-3"
				},
				medium: {
					root: ""
				},
				large: {
					root: "h-28 animate-app-bar-large px-2 pb-6 pt-3 [animation-range:0_7rem] [animation-timeline:scroll()]"
				}
			}
		},
		defaultVariants: {
			variant: "small",
			elevate: false,
			hide: false,
			position: "fixed"
		}
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

	const ref = useRef<ElementRef<"nav">>()

	const styles = appBar({
		variant,
		elevate,
		hide
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

	return (
		<AppBarContext.Provider value={styles}>
			{createElement("nav", {
				...props,
				ref,
				"data-hidden": hidden,
				"data-elevated": scrolled !== 0,
				style: {
					"--app-bar-height": (ref.current?.clientHeight ?? 0) + "px"
				},
				className: styles.root({ className: props.className })
			})}
		</AppBarContext.Provider>
	)
}
export function AppBarTitle(
	props: Ariakit.HeadingProps
): ReactNode {
	const styles = useContext(AppBarContext)
	return createElement(Ariakit.Heading, {
		...props,
		className: styles.title({ className: props.className })
	})
}
