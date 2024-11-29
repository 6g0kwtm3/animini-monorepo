import { tv } from "./tailwind-variants"

export const createTextFieldInput = tv({
	slots: {
		containerBefore: "",
		container: "group @container flex w-full items-center",
		containerAfter: "",
		icon: "text-on-surface-variant i group-[]/suffix:me-3 group-[]/suffix:ms-0 group-has-[[aria-disabled='true']]:text-on-surface/[.38] group-error:group-[]/suffix:text-error group-error:group-hover:group-[]/suffix:text-on-error-container group-error:group-hover:group-has-focused:group-[]/suffix:text-error pointer-events-none ms-3 h-5 w-5",
		outline: "",
		suffix:
			"suffix text-body-lg text-on-surface-variant group-[]/suffix:-ms-4 group-[]/suffix:me-4 group-has-focused:block ms-4 -me-4 block group-has-[:placeholder-shown]:hidden",
		label:
			"text-body-sm text-on-surface-variant group-has-[:placeholder-shown]:text-body-lg group-has-[[aria-disabled='true']]:text-on-surface/[.38] group-error:text-error group-error:group-hover:text-on-error-container group-has-read-write:group-hover:text-on-surface group-has-focused:group-has-[:placeholder-shown]:text-body-sm group-error:group-has-focused:text-error group-has-read-write:group-has-focused:text-primary pointer-events-none absolute whitespace-nowrap transition-all group-has-[:placeholder-shown]:top-4",
		labelAfter: "hidden group-has-[:required]:inline",
		input:
			"peer text-body-lg text-on-surface caret-primary aria-[disabled='true']:text-on-surface/[.38] group-error:caret-error focused:placeholder-on-surface-variant [&_option]:bg-surface-container [&_option]:text-on-surface flex w-full min-w-0 resize-none items-center justify-between bg-transparent px-4 placeholder-transparent outline-hidden group-has-[.suffix]/suffix:[appearance:textfield] group-has-[.suffix]/suffix:text-right placeholder:transition-all group-has-[.suffix]/suffix:[&::-webkit-inner-spin-button]:hidden",
	},
	variants: {
		variant: {
			filled: {
				container:
					"bg-surface-container-highest hover:state-hover hover:has-[[aria-disabled='true']]:state-none has-focused:hover:state-none relative rounded-t-xs",
				containerAfter:
					"border-primary duration-sm ease-standard-accelerate group-error:border-error group-has-focused:scale-x-100 group-error:group-has-focused:scale-x-100 absolute start-0 end-0 bottom-0 scale-x-0 border-b-2 transition-transform",
				containerBefore:
					"border-on-surface-variant group-hover:border-on-surface group-has-[[aria-disabled='true']]:border-on-surface/[.38] group-hover:group-has-[[aria-disabled='true']]:border-on-surface/[.38] group-error:border-error group-error:group-hover:border-on-error-container absolute start-0 end-0 bottom-0 border-b",
				outline: "hidden",
				suffix: "pt-6 pb-2",
				label:
					"group-has-focused:group-has-[:placeholder-shown]:top-2 start-4 top-2",
				input: "min-h-[3.5rem] pt-6 pb-2",
			},
			outlined: {
				input: "py-4",
				label:
					"group-has-focused:group-has-[:placeholder-shown]:-top-2 group-has-focused:group-has-[:placeholder-shown]:start-[calc(100%-100cqi+1rem)] start-[calc(100%-100cqi+1rem)] -top-2 group-has-[:placeholder-shown]:start-4",
				container: "",
				outline:
					"border-outline group-has-[[aria-disabled='true']]:border-outline/[.12] group-hover:group-has-[[aria-disabled='true']]:border-outline/[.12] group-error:border-error group-hover:group-error:border-on-error-container group-has-read-write:group-hover:border-on-surface group-has-focused:group-error:border-error group-has-focused:group-hover:group-error:border-error group-has-read-write:group-has-focused:border-2 group-has-read-write:group-has-focused:border-primary group-has-read-write:group-hover:group-has-focused:border-primary pointer-events-none absolute start-0 end-0 -top-[0.71875rem] bottom-0 rounded-xs border px-[0.625rem] transition-all",
			},
		},
	},
	defaultVariants: {
		variant: "filled",
	},
})

export const createTextField = tv({
	slots: {
		text: "text-body-sm text-on-surface-variant group-has-[[aria-disabled='true']]:text-on-surface/[.38] group-error:text-error gap-4 px-4 pt-1",
		root: "group mt-[0.625rem]",
	},
})
