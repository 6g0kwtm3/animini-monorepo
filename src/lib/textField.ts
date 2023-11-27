import { tv } from "tailwind-variants"

export const textField = tv({
	slots: {
		input: "",
		root: "",
		trailingIcon: "",
	},
	variants: {
		variant: {
			outlined: {
				input:
					"peer flex min-w-0 flex-1 resize-none items-center justify-between bg-transparent p-4 text-body-lg text-on-surface placeholder-transparent caret-primary outline-none placeholder:transition-all focus:placeholder-on-surface-variant focus:ring-0 disabled:text-on-surface/[.38] group-error:caret-error",
				root: "group relative mt-[10px] flex items-center",
				trailingIcon:
					"me-3 h-6 w-6 text-on-surface-variant peer-disabled:text-on-surface/[.38] group-error:text-error group-error:group-hover:text-on-error-container group-error:group-hover:group-focus-within:text-error",
			},
		},
	},
	defaultVariants: {
		variant: "outlined",
	},
})
