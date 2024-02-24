import {
	createContext,
	type ComponentPropsWithoutRef,
	type ReactElement,
	useContext
} from "react"
import { createTV, type VariantProps } from "tailwind-variants"

import { createElement } from "~/lib/createElement"

const tv = createTV({ twMerge: false })

const createLayout = tv(
	{
		slots: {
			root: "grid h-[100dvh]",
			body: "flex max-h-full gap-6 overflow-y-auto [grid-area:body]"
		},
		variants: {
			navigation: {
				left: {
					root: "[grid:'top-app-bar_top-app-bar'auto'tabs_tabs'auto'navigation_body'1fr/auto_1fr]",
					body: "pe-4 sm:pe-6 ps-0 sm:ps-0"
				},
				bottom: {
					root: " [grid:'top-app-bar'auto'tabs'auto'body'1fr'navigation'auto/1fr]",
					body: "sm:pe-6 sm:ps-6 pe-4 ps-4"
				}
			}
		},
		defaultVariants: { navigation: "bottom" }
	},
	{ responsiveVariants: ["sm"] }
)

const LayoutContext = createContext(createLayout())

export function Layout({
	navigation,
	...props
}: ComponentPropsWithoutRef<"div"> & VariantProps<typeof createLayout>) {
	const styles = createLayout({ navigation })
	return (
		<LayoutContext.Provider value={styles}>
			<div className={styles.root({ className: props.className })}>
				{props.children}
			</div>
		</LayoutContext.Provider>
	)
}

export function LayoutBody(props: ComponentPropsWithoutRef<"main">) {
	const { body } = useContext(LayoutContext)
	return (
		<main {...props} className={body({ className: props.className })}></main>
	)
}

const pane = tv({
	base: "flex flex-col",
	variants: {
		variant: {
			fixed: "w-[22.5rem]",
			flexible: "flex-1"
		}
	},
	defaultVariants: { variant: "flexible" }
})

export function LayoutPane({
	variant,
	...props
}: ComponentPropsWithoutRef<"div"> &
	VariantProps<typeof pane> & {
		render?: ReactElement
	}) {
	return createElement("section", {
		...props,
		className: pane({ className: props.className, variant })
	})
}
