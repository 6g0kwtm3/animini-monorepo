import { tv } from "./tailwind-variants"

export const cardBody = tv({
	base: "overflow-y-auto",
})

export const cardHeader = tv({
	base: "",
})

export const cardFooter = tv({
	base: "",
})

export const card = tv({
	base: "text-body-md relative flex h-auto flex-col gap-4 rounded-md p-4",
	variants: {
		variant: {
			outlined:
				"border-outline-variant bg-surface disabled:border-outline/[.12] border",
			filled:
				"bg-surface-container-highest disabled:bg-surface-container-highest/[.38]",
			elevated:
				"bg-surface-container-low disabled:bg-surface-container-low/[.38] shadow",
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
