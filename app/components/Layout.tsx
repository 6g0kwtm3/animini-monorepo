import type { ComponentProps, ComponentRef, ReactNode, RefObject } from "react"
import { createContext, use, useRef } from "react"
import type { VariantProps } from "tailwind-variants"

import { tv } from "~/lib/tailwind-variants"

const createLayout = tv(
	{
		slots: {
			root: "isolate",
			body: "flex gap-6 pe-4 sm:pe-6",
		},
		variants: {
			navigation: {
				none: { body: "ps-4 pb-0 sm:ps-6" },
				bar: {
					root: "",
					body: "ps-4 pb-20 sm:ps-6",
				},
				rail: {
					root: "",
					body: "ps-20 pb-0 sm:ps-20",
				},
				drawer: {
					root: "",
					body: "ps-[22.5rem] pb-0 sm:ps-[22.5rem]",
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
	return <main {...props} className={body({ className: props.className })} />
}

export const PaneContext = createContext<RefObject<ComponentRef<"div"> | null>>(
	{
		current: null,
	}
)

const pane = tv(
	{
		base: "block overflow-x-hidden overflow-y-auto rounded-md",
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
}: ComponentProps<"div"> & VariantProps<typeof pane>): ReactNode {
	const ref = useRef<ComponentRef<"div">>(null)
	const ctx = use(LayoutNavigationContext)

	return (
		<PaneContext value={ref}>
			<section
				{...props}
				ref={ref}
				className={pane({
					className: props.className,
					variant,
					navigation: ctx,
				})}
			/>
		</PaneContext>
	)
}
