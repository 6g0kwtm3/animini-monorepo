import * as Ariakit from "@ariakit/react"
import type { ComponentProps, ReactNode } from "react"
import {
	createContext,
	useContext,
	useDeferredValue,
	useState,
	useSyncExternalStore,
} from "react"
import type { VariantProps } from "tailwind-variants"

import { numberToString } from "~/lib/numberToString"
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
					root: "ease-spatial duration-spatial transform-gpu transition-transform data-[hidden='true']:-translate-y-(--app-bar-height) sm:data-[hidden='true']:translate-y-0",
				},
				false: { root: "" },
			},
			variant: {
				centered: { root: "" },
				small: { root: "h-16 px-2 pt-3 pb-3" },
				medium: { root: "" },
				large: {
					root: "animate-app-bar-large h-28 px-2 pt-3 pb-6 [animation-range:0_7rem] [animation-timeline:scroll()]",
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
AppBarContext.displayName = "AppBarContext"
interface AppBarProps
	extends ComponentProps<"nav">, VariantProps<typeof appBar> {}

export function AppBar({
	variant,
	elevate,
	hide,
	...props
}: AppBarProps): ReactNode {
	const styles = appBar({ variant, elevate, hide })

	const scrolled = useDeferredValue(
		useSyncExternalStore(
			(onChange) => {
				const controller = new AbortController()
				window.addEventListener("scroll", onChange, controller)
				return () => {
					controller.abort()
				}
			},
			() => window.scrollY,
			() => 0
		)
	)

	const [prevScroll, setPrevScroll] = useState(scrolled)
	const [hidden, setHidden] = useState(prevScroll < scrolled)

	if (prevScroll !== scrolled) {
		setPrevScroll(scrolled)
		setHidden(prevScroll < scrolled)
	}

	const [observer] = useState(
		() =>
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

	return (
		<AppBarContext.Provider value={styles}>
			<nav
				{...props}
				ref={(node) => {
					if (!node) return
					observer.observe(node)
					return () => {
						observer.unobserve(node)
					}
				}}
				data-hidden={hidden}
				data-elevated={scrolled !== 0}
				className={styles.root({ className: props.className })}
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
