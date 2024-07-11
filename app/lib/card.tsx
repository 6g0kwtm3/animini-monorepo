import { tv } from "./tailwind-variants"

export const cardBody = tv({
	base: "overflow-y-auto text-body-md",
})

export const cardHeader = tv({
	base: "",
})

export const cardFooter = tv({
	base: "",
})
export const card = tv({
	base: "relative flex h-auto flex-col gap-4 overflow-hidden rounded-md p-4",
	variants: {
		variant: {
			outlined:
				"border border-outline-variant bg-surface disabled:border-outline/[.12]",
			filled:
				"bg-surface-container-highest disabled:bg-surface-container-highest/[.38]",
			elevated:
				"bg-surface-container-low shadow disabled:bg-surface-container-low/[.38]",
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
