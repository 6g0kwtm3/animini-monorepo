import { tv } from "~/lib/tailwind-variants"
export const createTextField = tv({
	slots: {
		input: "",
		root: "",
	},
	variants: {
		variant: {
			outlined: {
				input:
					"text-body-lg text-on-surface caret-primary focus:placeholder-on-surface-variant disabled:text-on-surface/[.38] group-error:caret-error [&_option]:bg-surface-container [&_option]:text-on-surface peer flex min-w-0 flex-1 resize-none items-center justify-between bg-transparent p-4 placeholder-transparent placeholder:transition-all group-has-[.suffix]:text-right group-has-[.suffix]:[appearance:textfield] [&::-webkit-inner-spin-button]:group-has-[.suffix]:hidden",
				root: "group relative mt-[10px] flex items-center",
			},
		},
	},
	defaultVariants: {
		variant: "outlined",
	},
})
