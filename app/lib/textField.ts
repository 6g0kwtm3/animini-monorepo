import { createTV } from "tailwind-variants"

const tv = createTV({ twMerge: false })

export const createTextFieldInput = tv({
	slots: {
		container: "group flex w-full items-center @container",
		icon: "pointer-events-none ms-3 h-5 w-5 text-on-surface-variant i group-[]/suffix:me-3 group-[]/suffix:ms-0 group-has-[[aria-disabled='true']]:text-on-surface/[.38] group-error:group-[]/suffix:text-error group-error:group-hover:group-[]/suffix:text-on-error-container group-error:group-hover:group-has-focused:group-[]/suffix:text-error",
		outline: "",
		suffix:
			"suffix -me-4 ms-4 block text-body-lg text-on-surface-variant group-[]/suffix:-ms-4 group-[]/suffix:me-4 group-has-[:placeholder-shown]:hidden group-has-focused:block",
		label:
			"pointer-events-none absolute whitespace-nowrap text-body-sm text-on-surface-variant transition-all group-hover:text-on-surface group-has-[:placeholder-shown]:top-4 group-has-[:placeholder-shown]:text-body-lg group-has-[[aria-disabled='true']]:text-on-surface/[.38] group-has-[:required]:after:content-['*'] group-error:text-error group-error:group-hover:text-on-error-container group-has-focused:text-primary group-has-focused:group-has-[:placeholder-shown]:text-body-sm group-error:group-has-focused:text-error",
		input:
			"peer w-full min-w-0 items-center px-4 group-has-[.suffix]/suffix:text-right group-has-[.suffix]/suffix:[appearance:textfield] group-error:caret-error group-has-[.suffix]/suffix:[&::-webkit-inner-spin-button]:hidden caret-primary placeholder-transparent text-body-lg text-on-surface outline-none flex [&_option]:bg-surface-container [&_option]:text-on-surface focused:placeholder-on-surface-variant placeholder:transition-all aria-[disabled='true']:text-on-surface/[.38] resize-none justify-between bg-transparent"
	},
	variants: {
		variant: {
			filled: {
				container:
					"rounded-t-xs bg-surface-container-highest before:absolute before:bottom-0 before:end-0 before:start-0 before:border-b before:border-on-surface-variant after:absolute after:bottom-0 after:end-0 after:start-0 after:scale-x-0 after:border-b-2 after:border-primary after:transition-transform hover:state-hover hover:before:border-on-surface has-[[aria-disabled='true']]:before:border-on-surface/[.38] hover:has-[[aria-disabled='true']]:state-none hover:has-[[aria-disabled='true']]:before:border-on-surface/[.38] error:before:border-error error:after:border-error error:hover:before:border-on-error-container has-focused:after:scale-x-100 has-focused:hover:state-none error:has-focused:after:scale-x-100",
				outline: "hidden",
				suffix: "pb-2 pt-6",
				label:
					"start-4 top-2 group-has-focused:group-has-[:placeholder-shown]:top-2",
				input:
					"min-h-[3.5rem] pb-2 pt-6"
			},
			outlined: {
				input:
					"py-4",
				label:
					"-top-2 start-[calc(100%-100cqi+1rem)] group-has-[:placeholder-shown]:start-4 group-has-focused:group-has-[:placeholder-shown]:-top-2 group-has-focused:group-has-[:placeholder-shown]:start-[calc(100%-100cqi+1rem)]",
				container: "",
				outline:
					"pointer-events-none absolute -top-[0.71875rem] bottom-0 end-0 start-0 rounded-xs border border-outline px-[0.625rem] transition-all group-hover:border-on-surface group-has-[[aria-disabled='true']]:border-outline/[.12] group-hover:group-has-[[aria-disabled='true']]:border-outline/[.12] group-error:border-error group-hover:group-error:border-on-error-container group-has-focused:border-2 group-has-focused:border-primary group-hover:group-has-focused:border-primary group-has-focused:group-error:border-error group-has-focused:group-hover:group-error:border-error"
			}
		}
	},
	defaultVariants: {
		variant: "filled"
	}
})

export const createTextField = tv({
	slots: {
		text: "gap-4 px-4 pt-1 text-body-sm text-on-surface-variant group-has-[[aria-disabled='true']]:text-on-surface/[.38] group-error:text-error",
		root: "group mt-[0.625rem]"
	}
})
