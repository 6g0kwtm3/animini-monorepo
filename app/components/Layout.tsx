import type { ComponentProps, ReactNode } from "react"
import { createContext, use } from "react"

import { createTV, type VariantProps } from "tailwind-variants"

const tv = createTV({ twMerge: false })

const createLayout = tv(
	{
		slots: {
			root: "isolate",
			body: "flex gap-6 pe-4 sm:pe-6",
		},
		variants: {
			navigation: {
				none: { body: "pb-0 ps-4 sm:ps-6" },
				bar: {
					root: "",
					body: "pb-20 ps-4 sm:ps-6",
				},
				rail: {
					root: "",
					body: "pb-0 ps-20 sm:ps-20",
				},
				drawer: {
					root: "",
					body: "pb-0 ps-[22.5rem] sm:ps-[22.5rem]",
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
		<LayoutContext.Provider value={styles}>
			<div className={styles.root({ className: props.className })}>
				{props.children}
			</div>
		</LayoutContext.Provider>
	)
}
export function LayoutBody(props: ComponentProps<"main">): ReactNode {
	const { body } = use(LayoutContext)
	return <main {...props} className={body({ className: props.className })} />
}

const pane = tv({
	base: "block",
	variants: {
		variant: {
			fixed: "w-[22.5rem]",
			flexible: "w-full flex-grow",
		},
	},
	defaultVariants: { variant: "flexible" },
})
export function LayoutPane({
	variant,
	...props
}: ComponentProps<"div"> & VariantProps<typeof pane>): ReactNode {
	return (
		<section
			{...props}
			className={pane({ className: props.className, variant })}
		/>
	)
}
