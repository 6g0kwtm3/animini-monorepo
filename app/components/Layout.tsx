import type { ComponentPropsWithoutRef, ReactElement } from "react"
import { createTV, type VariantProps } from "tailwind-variants"

import { createElement } from "~/lib/createElement"

const tv = createTV({ twMerge: false })

const pane = tv({
	base: "flex-col",
	variants: {
		variant: {
			fixed: "hidden w-[22.5rem] md:flex",
			flexible: "flex flex-1"
		}
	},
	defaultVariants: { variant: "flexible" }
})

const layout = tv({
	base: "flex flex-1 gap-6 px-4 sm:px-6",
})

export function Layout(props: ComponentPropsWithoutRef<"div">) {
	return <div className={layout({className:props.className})}>{props.children}</div>
}

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
