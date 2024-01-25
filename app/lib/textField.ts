import { tv } from "tailwind-variants"

export const textField = tv({
	slots: {
		input: "",
		root: ""
	},
	variants: {
		variant: {
			outlined: {
				input:
					"peer flex min-w-0 flex-1 resize-none items-center justify-between bg-transparent p-4 text-body-lg text-on-surface placeholder-transparent caret-primary outline-none placeholder:transition-all focus:placeholder-on-surface-variant disabled:text-on-surface/[.38] group-has-[.suffix]:text-right group-has-[.suffix]:[appearance:textfield] group-error:caret-error group-has-[.suffix]:[&::-webkit-inner-spin-button]:hidden [&_option]:bg-surface-container [&_option]:text-on-surface",
				root: "group relative mt-[10px] flex items-center"
			}
		}
	},
	defaultVariants: {
		variant: "outlined"
	}
})
