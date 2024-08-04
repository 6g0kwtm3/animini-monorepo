import { tv } from "~/lib/tailwind-variants"

export const subheader = tv({
	base: "truncate px-4 text-body-md text-on-surface-variant",
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
