import { defineRecipe } from "@pandacss/dev"

export const buttonRecipe = defineRecipe({
	className: "button",
	description: "The styles for the Button component",
	base: {
		textBox: "trim-both cap alphabetic",
		backgroundColor: "{colors.primary}",
		textStyle: "label-lg",
		state: {
			_hover: "hover",
			_focusVisible: "focus",
			_active: "pressed",
			_disabled: "none",
			'&[aria-disabled="true"]': "none",
		},
	},
	variants: {
		color: { outlined: {}, elevated: {}, filled: {}, text: {}, tonal: {} },
		size: {
			xs: { paddingInline: ".75rem" },
			sm: { paddingInline: "1rem" },
			md: {},
			lg: {},
			xl: {},
		},
		shape: { round: {}, square: {} },
	},
	defaultVariants: { color: "filled", size: "sm", shape: "round" },
})
