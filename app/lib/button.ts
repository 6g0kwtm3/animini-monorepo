import { tv } from "tailwind-variants"

export const btnIcon = tv({
	base: "relative h-10 w-10 select-none rounded-full bg-center p-2 text-on-surface-variant i hover:state-hover focused:outline focused:state-focus pressed:state-pressed",
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
		root: "inline-flex h-10 min-w-[3rem] select-none items-center justify-center whitespace-nowrap rounded-[1.25rem] text-label-lg hover:state-hover focus-visible:state-focus active:state-pressed aria-disabled:cursor-not-allowed aria-disabled:text-on-surface/[.38] aria-disabled:state-none data-[active]:state-pressed data-[focus-visible]:state-focus focused:outline",
		icon: "dummy h-[1.125rem] w-[1.125rem] i-[1.125rem]",
	},
	variants: {
		variant: {
			outlined: {
				root: "gap-4 px-6 text-primary ring-1 ring-inset ring-outline aria-disabled:ring-on-surface/[.12] focused:ring-primary",
				icon: "-mx-2",
			},
			elevated: {
				root: "gap-4 bg-surface-container-low px-6 text-primary shadow hover:bg-surface-container aria-disabled:bg-on-surface/[.12] aria-disabled:shadow-none aria-disabled:hover:bg-surface-container-low",
				icon: "-mx-2",
			},
			filled: {
				root: "gap-4 bg-primary px-6 text-on-primary aria-disabled:bg-on-surface/[.12]",
				icon: "-mx-2",
			},
			text: {
				root: "gap-2 px-4 text-primary [&:not(:has(.dummy))]:px-3",
				icon: "first:-ms-1 last:-me-1",
			},
			tonal: {
				root: "gap-4 bg-secondary-container px-6 text-on-secondary-container hover:shadow aria-disabled:bg-on-surface/[.12] aria-disabled:hover:bg-surface",
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
	base: "block shadow i hover:state-hover focus-visible:state-focus active:state-pressed aria-disabled:cursor-not-allowed data-[active]:state-pressed data-[focus-visible]:state-focus",
	variants: {
		size: {
			default: "h-14 w-14 rounded-[1rem] p-4",
			small: "h-10 w-10 rounded-md p-2",
			large: "h-24 w-24 rounded-xl p-[1.875rem] i-9",
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
