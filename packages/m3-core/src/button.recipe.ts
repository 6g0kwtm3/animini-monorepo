import { defineRecipe } from "@pandacss/dev"

export const button = defineRecipe({
	className: "button",
	description: "The styles for the Button component",
	base: {
		display: "inline-flex",
		alignItems: "center",
		justifyContent: "center",
		whiteSpace: "nowrap",
		textBox: "trim-both cap alphabetic",
		textStyle: "label-lg",
		state: {
			_hover: "hover",
			_focusVisible: { base: "focus", _hover: "focus" },
			_active: "pressed",
			_disabled: "none",
			'&[aria-disabled="true"]': "none",
		},
		_motionSafe: {
			transition:
				"border-radius {durations.spatial.fast} {easings.spatial.fast}",
		},
	},
	variants: {
		color: {
			outlined: {
				ringColor: {
					base: "{colors.outline}",
					'&[aria-disabled="true"]': "{colors.outline-variant/12}",
				},
				ringInset: "inset",
				ring: 1,
				color: "{colors.on-surface-variant}",
			},
			elevated: {
				backgroundColor: "{colors.surface-container-low}",
				color: "{colors.primary}",
			},
			filled: {
				backgroundColor: "{colors.primary}",
				color: "{colors.on-primary}",
			},
			text: { color: "{colors.primary}" },
			tonal: {
				backgroundColor: "{colors.secondary-container}",
				color: "{colors.on-secondary-container}",
			},
		},
		size: {
			xs: { height: "2rem", gap: ".25rem", paddingInline: ".75rem" },
			sm: { height: "2.5rem", gap: ".5rem", paddingInline: "1rem" },
			md: {
				height: "3.5rem",
				gap: ".5rem",
				paddingInline: "1.5rem",
				textStyle: "title-md",
			},
			lg: {
				height: "6rem",
				gap: ".75rem",
				paddingInline: "3rem",
				textStyle: "headline-sm",
				ring: 2,
			},
			xl: {
				height: "8.5rem",
				gap: "1rem",
				paddingInline: "4rem",
				textStyle: "headline-lg",
				ring: 3,
			},
		},
		shape: { round: {}, square: {} },
	},
	compoundVariants: [
		{
			size: "xs",
			shape: "round",
			css: { borderRadius: { base: "1rem", _active: ".5rem" } },
		},
		{
			size: "sm",
			shape: "round",
			css: { borderRadius: { base: "1.25rem", _active: ".5rem" } },
		},
		{
			size: "md",
			shape: "round",
			css: { borderRadius: { base: "1.75rem", _active: ".75rem" } },
		},
		{
			size: "lg",
			shape: "round",
			css: { borderRadius: { base: "3rem", _active: "1rem" } },
		},
		{
			size: "xl",
			shape: "round",
			css: { borderRadius: { base: "4.25rem", _active: "1rem" } },
		},
		{
			size: ["xs", "sm"],
			shape: "square",
			css: { borderRadius: { base: ".75rem", _active: ".5rem" } },
		},
		{
			size: "md",
			shape: "square",
			css: { borderRadius: { base: "1rem", _active: ".75rem" } },
		},
		{
			size: ["lg", "xl"],
			shape: "square",
			css: { borderRadius: { base: "1.75rem", _active: "1rem" } },
		},
	],
	defaultVariants: { color: "filled", size: "sm", shape: "round" },
	jsx: ["Button"],
})
