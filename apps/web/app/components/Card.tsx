import { Role } from "@ariakit/react"
import type { ReactNode } from "react"

import type { VariantProps } from "tailwind-variants"

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

import * as Ariakit from "@ariakit/react"
interface CardProps
	extends Ariakit.RoleProps<"section">,
		VariantProps<typeof card> {}

export function Card({ variant, ...props }: CardProps): ReactNode {
	return (
		<Role.section
			{...props}
			className={card({ variant: variant, className: props.className })}
		></Role.section>
	)
}
