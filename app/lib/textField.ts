import { tv } from "./tailwind-variants"

export const createTextFieldInput = tv({
	slots: {
		containerBefore: "",
		container: "group flex w-full items-center @container",
		containerAfter: "",
		icon: "pointer-events-none ms-3 h-5 w-5 text-on-surface-variant i group-[]/suffix:me-3 group-[]/suffix:ms-0 group-has-[[aria-disabled='true']]:text-on-surface/[.38] group-error:group-[]/suffix:text-error group-error:group-hover:group-[]/suffix:text-on-error-container group-error:group-hover:group-has-focused:group-[]/suffix:text-error",
		outline: "",
		suffix:
			"suffix -me-4 ms-4 block text-body-lg text-on-surface-variant group-[]/suffix:-ms-4 group-[]/suffix:me-4 group-has-[:placeholder-shown]:hidden group-has-focused:block",
		label:
			"pointer-events-none absolute whitespace-nowrap text-body-sm text-on-surface-variant transition-all group-has-read-write:group-hover:text-on-surface group-has-[:placeholder-shown]:top-4 group-has-[:placeholder-shown]:text-body-lg group-has-[[aria-disabled='true']]:text-on-surface/[.38] group-error:text-error group-error:group-hover:text-on-error-container group-has-read-write:group-has-focused:text-primary group-has-focused:group-has-[:placeholder-shown]:text-body-sm group-error:group-has-focused:text-error",
		labelAfter: "hidden group-has-[:required]:inline",
		input:
			"peer flex w-full min-w-0 resize-none items-center justify-between bg-transparent px-4 text-body-lg text-on-surface placeholder-transparent caret-primary outline-none placeholder:transition-all group-has-[.suffix]/suffix:text-right group-has-[.suffix]/suffix:[appearance:textfield] aria-[disabled='true']:text-on-surface/[.38] group-error:caret-error focused:placeholder-on-surface-variant group-has-[.suffix]/suffix:[&::-webkit-inner-spin-button]:hidden [&_option]:bg-surface-container [&_option]:text-on-surface",
	},
	variants: {
		variant: {
			filled: {
				container:
					"rounded-t-xs bg-surface-container-highest hover:state-hover hover:has-[[aria-disabled='true']]:state-none has-focused:hover:state-none",
				containerAfter:
					"absolute bottom-0 end-0 start-0 scale-x-0 border-b-2 border-primary transition-transform duration-sm ease-standard-accelerate group-error:border-error group-has-focused:scale-x-100 group-error:group-has-focused:scale-x-100",
				containerBefore:
					"absolute bottom-0 end-0 start-0 border-b border-on-surface-variant group-hover:border-on-surface group-has-[[aria-disabled='true']]:border-on-surface/[.38] group-hover:group-has-[[aria-disabled='true']]:border-on-surface/[.38] group-error:border-error group-error:group-hover:border-on-error-container",
				outline: "hidden",
				suffix: "pb-2 pt-6",
				label:
					"start-4 top-2 group-has-focused:group-has-[:placeholder-shown]:top-2",
				input: "min-h-[3.5rem] pb-2 pt-6",
			},
			outlined: {
				input: "py-4",
				label:
					"-top-2 start-[calc(100%-100cqi+1rem)] group-has-[:placeholder-shown]:start-4 group-has-focused:group-has-[:placeholder-shown]:-top-2 group-has-focused:group-has-[:placeholder-shown]:start-[calc(100%-100cqi+1rem)]",
				container: "",
				outline:
					"pointer-events-none absolute -top-[0.71875rem] bottom-0 end-0 start-0 rounded-xs border border-outline px-[0.625rem] transition-all group-has-read-write:group-hover:border-on-surface group-has-[[aria-disabled='true']]:border-outline/[.12] group-hover:group-has-[[aria-disabled='true']]:border-outline/[.12] group-error:border-error group-hover:group-error:border-on-error-container group-has-read-write:group-has-focused:border-2 group-has-read-write:group-has-focused:border-primary group-has-read-write:group-hover:group-has-focused:border-primary group-has-focused:group-error:border-error group-has-focused:group-hover:group-error:border-error",
			},
		},
	},
	defaultVariants: {
		variant: "filled",
	},
})

export const createTextField = tv({
	slots: {
		text: "gap-4 px-4 pt-1 text-body-sm text-on-surface-variant group-has-[[aria-disabled='true']]:text-on-surface/[.38] group-error:text-error",
		root: "group mt-[0.625rem]",
	},
})
