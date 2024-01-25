import { createTV } from "tailwind-variants"

const tv = createTV({ twMerge: false })

export const btnIcon = tv({
	base: "i relative select-none rounded-full bg-center p-2 text-on-surface-variant state-on-surface-variant hover:state-hover focus-visible:state-focus active:state-pressed data-[active]:state-pressed data-[focus-visible]:state-focus",
	variants: {
		variant: {
			standard: ""
		}
	},
	defaultVariants: {
		variant: "standard"
	}
})

export const button = tv({
	base: "inline-flex h-10 min-w-[3rem] select-none items-center justify-center whitespace-nowrap rounded-[1.25rem] text-label-lg hover:state-hover focus-visible:state-focus active:state-pressed aria-disabled:cursor-not-allowed aria-disabled:text-on-surface/[.38] aria-disabled:state-none data-[active]:state-pressed data-[focus-visible]:state-focus",
	variants: {
		variant: {
			outlined:
				"gap-4 border border-outline px-6 text-primary state-primary focus:border-primary aria-disabled:border-on-surface/[.12]",
			elevated:
				"gap-4 bg-surface px-6 text-primary shadow elevation-1 state-primary hover:elevation-2 aria-disabled:bg-on-surface/[.12] aria-disabled:shadow-none aria-disabled:hover:elevation-1",
			filled:
				"gap-4 bg-primary px-6 text-on-primary state-on-primary aria-disabled:bg-on-surface/[.12]",
			text: "gap-2 px-3 text-primary state-primary",
			tonal:
				"gap-4 bg-secondary-container px-6 text-on-secondary-container state-on-secondary-container hover:elevation-1 aria-disabled:bg-on-surface/[.12] aria-disabled:hover:elevation-0"
		}
	},
	defaultVariants: {
		variant: "text"
	}
})

export const fab = tv({
	base: "i shadow elevation-3 hover:state-hover focus-visible:state-focus active:state-pressed aria-disabled:cursor-not-allowed data-[active]:state-pressed data-[focus-visible]:state-focus",
	variants: {
		size: {
			default: "h-14 w-14 rounded-[1rem] p-4",
			small: "h-10 w-10 rounded-md p-2",
			large: "h-24 w-24 rounded-xl p-[1.875rem] i-9"
		},
		color: {
			surface: "bg-surface text-on-surface state-on-surface",
			primary:
				"bg-primary-container text-on-primary-container state-on-primary-container",
			secondary:
				"bg-secondary-container text-on-secondary-container state-on-secondary-container",
			tertiary:
				"bg-tertiary-container text-on-tertiary-container state-on-tertiary-container"
		}
	},
	defaultVariants: {
		size: "default",
		color: "primary"
	}
})
