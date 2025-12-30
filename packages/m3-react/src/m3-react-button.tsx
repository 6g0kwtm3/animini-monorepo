import * as design from "@anitrove/design"
import { media } from "@anitrove/design"
import { cva, defineCva } from "@anitrove/unstyled"

export const buttonDefinition = defineCva({
	base: {
		display: "inline-flex",
		alignItems: "center",
		justifyContent: "center",
		whiteSpace: "nowrap",
		textBox: "trim-both cap alphabetic",
		...design.tokens.typescale["label-lg"],
		...design.state({
			[media.hover]: "hover",
			[media["focus-visible"]]: { base: "focus", [media.hover]: "focus" },
			[media.active]: "pressed",
			[media.disabled]: "none",
		}),
		transitionProperty: { [media.motionSafe]: "border-radius" },
		...design.tokens.transitions.spatial.fast,
	},
	variants: {
		color: {
			outlined: {
				ringColor: {
					base: design.tokens.colors.outline,
					'&[aria-disabled="true"]': design.tokens.colors["outline-variant/12"],
				},
				ringInset: "inset",
				ring: 1,
				color: design.tokens.colors["on-surface-variant"],
			},
			elevated: {
				backgroundColor: design.tokens.colors["surface-container-low"],
				color: design.tokens.colors.primary,
			},
			filled: {
				backgroundColor: design.tokens.colors.primary,
				color: design.tokens.colors["on-primary"],
			},
			text: { color: design.tokens.colors.primary },
			tonal: {
				backgroundColor: design.tokens.colors["secondary-container"],
				color: design.tokens.colors["on-secondary-container"],
			},
		},
		size: {
			xs: {
				height: "2rem",
				gap: ".25rem",
				...design.utilities.paddingX(".75rem"),
			},
			sm: {
				height: "2.5rem",
				gap: ".5rem",
				...design.utilities.paddingX("1rem"),
			},
			md: {
				height: "3.5rem",
				gap: ".5rem",
				...design.utilities.paddingX("1.5rem"),
				...design.tokens.typescale["title-md"],
			},
			lg: {
				height: "6rem",
				gap: ".75rem",
				...design.utilities.paddingX("3rem"),
				...design.tokens.typescale["headline-sm"],
				ring: 2,
			},
			xl: {
				height: "8.5rem",
				gap: "1rem",
				...design.utilities.paddingX("4rem"),
				...design.tokens.typescale["headline-lg"],
				ring: 3,
			},
		},
		shape: { round: {}, square: {} },
	},
	compoundVariants: [
		{
			size: ["xs"],
			shape: ["round"],
			css: { borderRadius: { base: "1rem", [media.active]: ".5rem" } },
		},
		{
			size: ["sm"],
			shape: ["round"],
			css: { borderRadius: { base: "1.25rem", [media.active]: ".5rem" } },
		},
		{
			size: ["md"],
			shape: ["round"],
			css: { borderRadius: { base: "1.75rem", [media.active]: ".75rem" } },
		},
		{
			size: ["lg"],
			shape: ["round"],
			css: { borderRadius: { base: "3rem", [media.active]: "1rem" } },
		},
		{
			size: ["xl"],
			shape: ["round"],
			css: { borderRadius: { base: "4.25rem", [media.active]: "1rem" } },
		},
		{
			size: ["xs", "sm"],
			shape: ["square"],
			css: { borderRadius: { base: ".75rem", [media.active]: ".5rem" } },
		},
		{
			size: ["md"],
			shape: ["square"],
			css: {
				borderRadius: {
					base: design.tokens.borderRadius.lg,
					[media.active]: ".75rem",
				},
			},
		},
		{
			size: ["lg", "xl"],
			shape: ["square"],
			css: {
				borderRadius: {
					base: design.tokens.borderRadius.xl,
					[media.active]: "1rem",
				},
			},
		},
	],
	defaultVariants: { color: "filled", size: "sm", shape: "round" },
})

export const button = cva(buttonDefinition)
