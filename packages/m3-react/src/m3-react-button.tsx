import * as design from "@anitrove/design"
import { media } from "@anitrove/design"
import { cva, defineCva } from "@anitrove/unstyled"

export const buttonDefinition = defineCva({
	base: {
		alignItems: "center",
		display: "inline-flex",
		justifyContent: "center",
		textBox: "trim-both cap alphabetic",
		whiteSpace: "nowrap",
		...design.tokens.typescale["label-lg"],
		...design.state({
			[media.active]: "pressed",
			[media.disabled]: "none",
			[media.hover]: "hover",
			[media["focus-visible"]]: { base: "focus", [media.hover]: "focus" },
		}),
		transitionProperty: { [media.motionSafe]: "border-radius" },
		...design.tokens.transitions.spatial.fast,
	},
	compoundVariants: [
		{
			css: { borderRadius: { base: "1rem", [media.active]: ".5rem" } },
			shape: ["round"],
			size: ["xs"],
		},
		{
			css: { borderRadius: { base: "1.25rem", [media.active]: ".5rem" } },
			shape: ["round"],
			size: ["sm"],
		},
		{
			css: { borderRadius: { base: "1.75rem", [media.active]: ".75rem" } },
			shape: ["round"],
			size: ["md"],
		},
		{
			css: { borderRadius: { base: "3rem", [media.active]: "1rem" } },
			shape: ["round"],
			size: ["lg"],
		},
		{
			css: { borderRadius: { base: "4.25rem", [media.active]: "1rem" } },
			shape: ["round"],
			size: ["xl"],
		},
		{
			css: { borderRadius: { base: ".75rem", [media.active]: ".5rem" } },
			shape: ["square"],
			size: ["xs", "sm"],
		},
		{
			css: {
				borderRadius: {
					base: design.tokens.borderRadius.lg,
					[media.active]: ".75rem",
				},
			},
			shape: ["square"],
			size: ["md"],
		},
		{
			css: {
				borderRadius: {
					base: design.tokens.borderRadius.xl,
					[media.active]: "1rem",
				},
			},
			shape: ["square"],
			size: ["lg", "xl"],
		},
	],
	defaultVariants: { color: "filled", shape: "round", size: "sm" },
	variants: {
		color: {
			elevated: {
				backgroundColor: design.tokens.colors["surface-container-low"],
				color: design.tokens.colors.primary,
			},
			filled: {
				backgroundColor: design.tokens.colors.primary,
				color: design.tokens.colors["on-primary"],
			},
			outlined: {
				color: design.tokens.colors["on-surface-variant"],
				ring: 1,
				ringColor: {
					'&[aria-disabled="true"]': design.tokens.colors["outline-variant/12"],
					base: design.tokens.colors.outline,
				},
				ringInset: "inset",
			},
			text: { color: design.tokens.colors.primary },
			tonal: {
				backgroundColor: design.tokens.colors["secondary-container"],
				color: design.tokens.colors["on-secondary-container"],
			},
		},
		shape: { round: {}, square: {} },
		size: {
			lg: {
				gap: ".75rem",
				height: "6rem",
				paddingInline: "3rem",
				...design.tokens.typescale["headline-sm"],
				ring: 2,
			},
			md: {
				gap: ".5rem",
				height: "3.5rem",
				paddingInline: "1.5rem",
				...design.tokens.typescale["title-md"],
			},
			sm: { gap: ".5rem", height: "2.5rem", paddingInline: "1rem" },
			xl: {
				gap: "1rem",
				height: "8.5rem",
				paddingInline: "4rem",
				...design.tokens.typescale["headline-lg"],
				ring: 3,
			},
			xs: { gap: ".25rem", height: "2rem", paddingInline: ".75rem" },
		},
	},
})

export const button = cva(buttonDefinition)
