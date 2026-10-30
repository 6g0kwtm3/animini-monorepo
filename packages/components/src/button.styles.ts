import { tv } from "./tailwind-variants"

export const btnIcon = tv({
	base: "hover:state-hover focus-visible:state-focus active:state-pressed aria-disabled:text-on-surface/[.38] aria-disabled:state-none data-active:state-pressed data-focus-visible:state-focus ease-spatial-fast duration-spatial-fast relative flex items-center justify-center transition-all select-none aria-disabled:cursor-not-allowed",
	variants: {
		variant: {
			outlined:
				"text-on-surface-variant ring-outline-variant aria-disabled:ring-on-surface/[.12] ring-1 ring-inset",
			elevated:
				"bg-surface-container-low text-primary hover:bg-surface-container aria-disabled:bg-on-surface/[.12] aria-disabled:hover:bg-surface-container-low shadow-sm aria-disabled:shadow-none",
			filled: "bg-primary text-on-primary aria-disabled:bg-on-surface/[.12]",
			text: "text-primary",
			tonal:
				"bg-secondary-container text-on-secondary-container aria-disabled:bg-on-surface/[.12] aria-disabled:hover:bg-surface hover:shadow-sm",
		},
		size: {
			xs: "i-[1.25rem] pressed:rounded-[.5rem]",
			sm: "i-[1.5rem] pressed:rounded-[.5rem]",
			md: "i-[1.5rem] pressed:rounded-[.75rem]",
			lg: "i-[2rem] pressed:rounded-[1rem]",
			xl: "i-[2.5rem] pressed:rounded-[1rem]",
		},
		width: { default: "", narrow: "", wide: "" },
		shape: { rounded: "", square: "" },
	},
	compoundVariants: [
		{
			size: "xs",
			width: "default",
			className: "h-[2rem] w-[2rem] rounded-[1rem]",
		},
		{
			size: "sm",
			width: "default",
			className: "h-[2.5rem] w-[2.5rem] rounded-[1.25rem]",
		},
		{
			size: "md",
			width: "default",
			className: "h-[3.5rem] w-[3.5rem] rounded-[1.75rem]",
		},
		{
			size: "lg",
			width: "default",
			className: "h-[14rem] w-[14rem] rounded-[7rem]",
		},
		{
			size: "xl",
			width: "default",
			className: "h-[19.5rem] w-[19.5rem] rounded-[9.75rem]",
		},

		{
			size: "xs",
			width: "narrow",
			className: "h-[2rem] w-[1.75rem] rounded-[.875rem]",
		},
		{
			size: "sm",
			width: "narrow",
			className: "h-[2.5rem] w-[2rem] rounded-[1rem]",
		},
		{
			size: "md",
			width: "narrow",
			className: "h-[3.5rem] w-[3rem] rounded-[1.5rem]",
		},
		{
			size: "lg",
			width: "narrow",
			className: "h-[14rem] w-[4rem] rounded-[2rem]",
		},
		{
			size: "xl",
			width: "narrow",
			className: "h-[19.5rem] w-[6.5rem] rounded-[3.25rem]",
		},

		{
			size: "xs",
			width: "wide",
			className: "h-[2rem] w-[2.5rem] rounded-[1rem]",
		},
		{
			size: "sm",
			width: "wide",
			className: "h-[2.5rem] w-[3.25rem] rounded-[1.25rem]",
		},
		{
			size: "md",
			width: "wide",
			className: "h-[3.5rem] w-[4.5rem] rounded-[1.75rem]",
		},
		{
			size: "lg",
			width: "wide",
			className: "h-[14rem] w-[8rem] rounded-[4rem]",
		},
		{
			size: "xl",
			width: "wide",
			className: "h-[19.5rem] w-[11.5rem] rounded-[5.75rem]",
		},

		{ size: "xs", shape: "square", className: "rounded-[.75rem]" },
		{ size: "sm", shape: "square", className: "rounded-[.75rem]" },
		{ size: "md", shape: "square", className: "rounded-[1rem]" },
		{ size: "lg", shape: "square", className: "rounded-[1.75rem]" },
		{ size: "xl", shape: "square", className: "rounded-[1.75rem]" },
	],
	defaultVariants: {
		variant: "text",
		size: "sm",
		width: "default",
		shape: "rounded",
	},
})

export const createButton = tv({
	slots: {
		root: "text-label-lg hover:state-hover focus-visible:state-focus active:state-pressed aria-disabled:text-on-surface/[.38] aria-disabled:state-none data-active:state-pressed data-focus-visible:state-focus inline-flex h-10 min-w-[3rem] items-center justify-center rounded-[1.25rem] whitespace-nowrap select-none [text-box:trim-both_cap_alphabetic] aria-disabled:cursor-not-allowed",
		icon: "dummy i-[1.125rem] h-[1.125rem] w-[1.125rem]",
	},
	variants: {
		variant: {
			outlined: {
				root: "text-primary ring-outline aria-disabled:ring-on-surface/[.12] focused:ring-primary gap-4 px-6 ring-1 ring-inset",
				icon: "-mx-2",
			},
			elevated: {
				root: "bg-surface-container-low text-primary hover:bg-surface-container aria-disabled:bg-on-surface/[.12] aria-disabled:hover:bg-surface-container-low gap-4 px-6 shadow-sm aria-disabled:shadow-none",
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
				root: "bg-secondary-container text-on-secondary-container aria-disabled:bg-on-surface/[.12] aria-disabled:hover:bg-surface gap-4 px-6 hover:shadow-sm",
				icon: "-mx-2",
			},
		},
	},
	defaultVariants: { variant: "text" },
})

const { root: button } = createButton()
export { button }

export const fab = tv({
	base: "i hover:state-hover focus-visible:state-focus active:state-pressed data-active:state-pressed data-focus-visible:state-focus block shadow-sm aria-disabled:cursor-not-allowed",
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
	defaultVariants: { size: "default", color: "primary" },
})
