import { type ComponentPropsWithoutRef, type ReactElement } from "react"
import type { VariantProps } from "tailwind-variants"
import { createTV } from "tailwind-variants"
import { createElement } from "~/lib/createElement"

const tv = createTV({ twMerge: false })

const card = tv({
	base: "rounded-md p-4",
	variants: {
		variant: {
			outlined:
				"border border-outline-variant bg-surface disabled:border-outline/[.12]",
			filled:
				"bg-surface-container-highest disabled:bg-surface-container-highest/[.38]",
			elevated:
				"bg-surface-container-low shadow disabled:bg-surface-container-low/[.38]"
		},
		interactive: {
			true: "hover:state-hover focused:state-focus pressed:state-pressed",
			false: ""
		}
	},
	compoundVariants: [
		{
			variant: "outlined",
			interactive: true,
			className:
				"hover:bg-surface-container-low focused:border-on-surface pressed:border-outline-variant"
		},
		{
			variant: "filled",
			interactive: true,
			className: "hover:bg-surface-container-low"
		},
		{
			variant: "elevated",
			interactive: true,
			className: "hover:bg-surface-container"
		}
	],
	defaultVariants: { variant: "outlined", interactive: false }
})

export function Card({
	variant,
	...props
}: ComponentPropsWithoutRef<"section"> &
	VariantProps<typeof card> & {
		render?: ReactElement
	}) {
	return createElement("section", {
		...props,
		className: card({ variant: variant, className: props.className })
	})
}
