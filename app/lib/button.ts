import { tv } from "~/lib/tailwind-variants"

export const btnIcon = tv({
	base: "text-on-surface-variant i hover:state-hover focused:state-focus pressed:state-pressed relative h-10 w-10 rounded-full bg-center p-2 select-none",
	variants: {
		variant: {
			standard: "",
		},
	},
	defaultVariants: {
		variant: "standard",
	},
})

export const createButton = tv({
	slots: {
		root: "text-label-lg hover:state-hover focus-visible:state-focus active:state-pressed aria-disabled:text-on-surface/[.38] aria-disabled:state-none data-active:state-pressed data-focus-visible:state-focus inline-flex h-10 min-w-[3rem] items-center justify-center rounded-[1.25rem] whitespace-nowrap select-none aria-disabled:cursor-not-allowed",
		icon: "dummy i-[1.125rem] h-[1.125rem] w-[1.125rem]",
	},
	variants: {
		variant: {
			outlined: {
				root: "text-primary ring-outline aria-disabled:ring-on-surface/[.12] focused:ring-primary gap-4 px-6 ring-1 ring-inset",
				icon: "-mx-2",
			},
			elevated: {
				root: "bg-surface-container-low text-primary hover:bg-surface-container aria-disabled:bg-on-surface/[.12] aria-disabled:hover:bg-surface-container-low gap-4 px-6 shadow aria-disabled:shadow-none",
				icon: "-mx-2",
			},
			filled: {
				root: "bg-primary text-on-primary aria-disabled:bg-on-surface/[.12] gap-4 px-6",
				icon: "-mx-2",
			},
			text: {
				root: "text-primary gap-2 px-4 [&:not(:has(.dummy))]:px-3",
				icon: "first:-ms-1 last:-me-1",
			},
			tonal: {
				root: "bg-secondary-container text-on-secondary-container aria-disabled:bg-on-surface/[.12] aria-disabled:hover:bg-surface gap-4 px-6 hover:shadow",
				icon: "-mx-2",
			},
		},
	},
	defaultVariants: {
		variant: "text",
	},
})

const { root: button } = createButton()
export { button }

export const fab = tv({
	base: "i hover:state-hover focus-visible:state-focus active:state-pressed data-active:state-pressed data-focus-visible:state-focus block shadow aria-disabled:cursor-not-allowed",
	variants: {
		size: {
			default: "h-14 w-14 rounded-[1rem] p-4",
			small: "h-10 w-10 rounded-md p-2",
			large: "i-9 h-24 w-24 rounded-xl p-[1.875rem]",
		},
		color: {
			surface: "bg-surface text-on-surface",
			primary: "bg-primary-container text-on-primary-container",
			secondary: "bg-secondary-container text-on-secondary-container",
			tertiary: "bg-tertiary-container text-on-tertiary-container",
		},
	},
	defaultVariants: {
		size: "default",
		color: "primary",
	},
})
