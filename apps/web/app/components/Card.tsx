import { Role } from "@ariakit/react"
import type { ReactNode } from "react"

import type { VariantProps } from "tailwind-variants"

import { tv } from "~/lib/tailwind-variants"

const card = tv({
	base: "rounded-md p-4",
	compoundVariants: [
		{
			className:
				"hover:bg-surface-container-low focused:border-on-surface pressed:border-outline-variant",
			interactive: true,
			variant: "outlined",
		},
		{
			className: "hover:bg-surface-container-low",
			interactive: true,
			variant: "filled",
		},
		{
			className: "hover:bg-surface-container",
			interactive: true,
			variant: "elevated",
		},
	],
	defaultVariants: { interactive: false, variant: "outlined" },
	variants: {
		interactive: {
			false: "",
			true: "hover:state-hover focused:state-focus pressed:state-pressed",
		},
		variant: {
			elevated:
				"bg-surface-container-low disabled:bg-surface-container-low/[.38] shadow-sm",
			filled:
				"bg-surface-container-highest disabled:bg-surface-container-highest/[.38]",
			outlined:
				"border-outline-variant bg-surface disabled:border-outline/[.12] border",
		},
	},
})

import * as Ariakit from "@ariakit/react"
interface CardProps
	extends Ariakit.RoleProps<"section">,
		VariantProps<typeof card> {}

export function Card({ variant, ...props }: CardProps): ReactNode {
	return (
		<Role.section
			{...props}
			className={card({ className: props.className, variant: variant })}
		></Role.section>
	)
}
