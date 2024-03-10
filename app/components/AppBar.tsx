import type { ComponentPropsWithoutRef, ElementRef } from "react"
import { createContext, useContext, useEffect, useRef, useState } from "react"
import type { VariantProps } from "tailwind-variants"
import { createTV } from "tailwind-variants"
import { createElement } from "~/lib/createElement"

const tv = createTV({ twMerge: false })

const appBar = tv(
	{
		slots: {
			root: "grid bg-surface",
			title: "text-title-lg text-on-surface first:ms-2"
		},
		variants: {
			position: { fixed: { root: "sticky top-0" }, static: { root: "static" } },
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
					root: "min-h-16"
				},
				medium: {
					root: ""
				},
				large: {
					root: ""
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
}: ComponentPropsWithoutRef<"nav"> & VariantProps<typeof appBar>):JSX.Element {
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
export function AppBarTitle(props: ComponentPropsWithoutRef<"h1">):JSX.Element {
	const styles = useContext(AppBarContext)
	return createElement("h1", {
		...props,
		className: styles.title({ className: props.className })
	})
}
