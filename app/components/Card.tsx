import { type ComponentPropsWithoutRef, type ReactElement } from "react"
import type { VariantProps } from "tailwind-variants"
import { createTV } from "tailwind-variants"
import { createElement } from "~/lib/createElement"

const tv = createTV({ twMerge: false })

const card = tv({
	base: "rounded-md p-4 state-on-surface",
	variants: {
		variant: {
			outlined:
				"border-outline-variant border bg-surface elevation-0 disabled:border-outline/[.12]",
			filled:
				"bg-surface-container-highest elevation-0  disabled:bg-surface-variant/[.38]",
			elevated: "bg-surface-container-low elevation-1 disabled:bg-surface/[.38]"
		},
		interactive: {
			true: "pressed:state-pressed focused:state-focus hover:state-hover",
			false: ""
		}
	},
	compoundVariants: [
		{
			variant: "outlined",
			interactive: true,
			className:
				"focused:border-on-surface pressed:border-outline-variant pressed:elevation-0 focused:elevation-0  hover:elevation-1"
		},
		{
			variant: "filled",
			interactive: true,
			className: "focused:elevation-0 pressed:elevation-0 hover:elevation-1"
		},
		{
			variant: "elevated",
			interactive: true,
			className: "focused:elevation-1 pressed:elevation-1 hover:elevation-2"
		}
	],
	defaultVariants: { variant: "outlined", interactive: false }
})

export function Card({
	variant,
	...props
}: ComponentPropsWithoutRef<"div"> &
	VariantProps<typeof card> & {
		render?: ReactElement
	}) {
	return createElement("div", {
		...props,
		className: card({ variant: variant, className: props.className })
	})
}
