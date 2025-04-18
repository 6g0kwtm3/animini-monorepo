import type { ComponentPropsWithoutRef, ReactNode } from "react"

import type { VariantProps } from "tailwind-variants"
import { useCreateElement, type Options } from "~/lib/createElement"

import { tv } from "~/lib/tailwind-variants"

const card = tv({
	base: "rounded-md p-4",
	variants: {
		variant: {
			outlined:
				"border-outline-variant bg-surface disabled:border-outline/[.12] border",
			filled:
				"bg-surface-container-highest disabled:bg-surface-container-highest/[.38]",
			elevated:
				"bg-surface-container-low disabled:bg-surface-container-low/[.38] shadow-sm",
		},
		interactive: {
			true: "hover:state-hover focused:state-focus pressed:state-pressed",
			false: "",
		},
	},
	compoundVariants: [
		{
			variant: "outlined",
			interactive: true,
			className:
				"hover:bg-surface-container-low focused:border-on-surface pressed:border-outline-variant",
		},
		{
			variant: "filled",
			interactive: true,
			className: "hover:bg-surface-container-low",
		},
		{
			variant: "elevated",
			interactive: true,
			className: "hover:bg-surface-container",
		},
	],
	defaultVariants: { variant: "outlined", interactive: false },
})
export function Card({
	variant,
	...props
}: ComponentPropsWithoutRef<"section">
	& VariantProps<typeof card>
	& Options): ReactNode {
	return useCreateElement("section", {
		...props,
		className: card({ variant: variant, className: props.className }),
	})
}
