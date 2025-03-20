import { tv } from "~/lib/tailwind-variants"

export const subheader = tv({
	base: "text-body-md text-on-surface-variant truncate px-4",
	variants: {
		lines: {
			one: "py-2",
			two: "py-2",
			three: "py-3",
		},
	},
	defaultVariants: {
		lines: "two",
	},
})
