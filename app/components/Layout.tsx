import type { ComponentPropsWithoutRef, ReactElement } from "react"
import { createTV, type VariantProps } from "tailwind-variants"

import { createElement } from "~/lib/createElement"

const tv = createTV({ twMerge: false })

const layout = tv({
	base: "grid h-[100dvh] [grid:'body'1fr'navigation'auto/1fr] sm:[grid:'navigation_body'1fr/auto_1fr]"
})

export function Layout(props: ComponentPropsWithoutRef<"div">) {
	return (
		<div className={layout({ className: props.className })}>
			{props.children}
		</div>
	)
}

const body = tv({
	base: "flex max-h-full gap-6 overflow-y-auto px-4 [grid-area:body] sm:px-6"
})

export function LayoutBody(props: ComponentPropsWithoutRef<"main">) {
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
