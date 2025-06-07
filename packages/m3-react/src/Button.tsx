import * as Ariakit from "@ariakit/react"
import type { StyleXStyles } from "@stylexjs/stylex"
import * as stylex from "@stylexjs/stylex"
import {
	colors,
	durations,
	easings,
	fonts,
	letterSpacings,
	motion,
	state,
} from "./state.stylex"

const sizes = stylex.create({
	xs: {
		height: "2rem",
		gap: ".25rem",
		paddingInline: ".75rem",
		font: fonts.labelLg,
		letterSpacing: letterSpacings.labelLg,
	},
	sm: {
		height: "2.5rem",
		gap: ".5rem",
		paddingInline: "1rem",
		font: fonts.labelLg,
		letterSpacing: letterSpacings.labelLg,
	},
	md: {
		height: "3.5rem",
		gap: ".5rem",
		paddingInline: "1.5rem",
		font: fonts.titleMd,
		letterSpacing: letterSpacings.titleMd,
	},
	lg: {
		height: "6rem",
		gap: ".75rem",
		paddingInline: "3rem",
		font: fonts.headlineSm,
		letterSpacing: letterSpacings.headlineSm,
	},
	xl: {
		height: "8.5rem",
		gap: "1rem",
		paddingInline: "4rem",
		font: fonts.headlineLg,
		letterSpacing: letterSpacings.headlineLg,
	},
})

const variants = stylex.create({
	elevated: {
		"--elevation": {
			default: 1,
			":hover": { default: 2, ":focus-visible": 1 },
		},
		backgroundColor: {
			default: colors.surfaceContainerLow,
			":hover": {
				default: colors.surfaceContainer,
				":focus-visible": colors.surfaceContainerLow,
			},
		},
		color: colors.primary,
	},
	filled: { backgroundColor: colors.primary, color: colors.onPrimary },
	tonal: {
		backgroundColor: colors.secondaryContainer,
		color: colors.onSecondaryContainer,
	},
	outlined: { color: colors.onSurfaceVariant },
	text: { color: colors.primary },
})

const round = stylex.create({
	xs: { borderRadius: { default: "1rem", ":active": ".5rem" } },
	sm: { borderRadius: { default: "1.25rem", ":active": ".5rem" } },
	md: { borderRadius: { default: "1.75rem", ":active": ".75rem" } },
	lg: { borderRadius: { default: "3rem", ":active": "1rem" } },
	xl: { borderRadius: { default: "4.25rem", ":active": "1rem" } },
})

const square = stylex.create({
	xs: { borderRadius: { default: ".75rem", ":active": ".5rem" } },
	sm: { borderRadius: { default: ".75rem", ":active": ".5rem" } },
	md: { borderRadius: { default: "1rem", ":active": ".75rem" } },
	lg: { borderRadius: { default: "1.75rem", ":active": "1rem" } },
	xl: { borderRadius: { default: "1.75rem", ":active": "1rem" } },
})

const styles = stylex.create({
	button: {
		display: "inline-flex",
		alignItems: "center",
		justifyContent: "center",
		whiteSpace: "nowrap",
		textBox: "trim-both cap alphabetic",
		backgroundImage: {
			":hover": { default: state.hover, ":focus-visible": state.focus },
			":focus-visible": state.focus,
			":active": state.pressed,
		},
		transition: {
			[motion.safe]: `border-radius ${durations.spatialFast} ${easings.spatialFast}`,
		},
		// transitionProperty: { [motion.safe]: "border-radius" },
		// transitionDuration: { [motion.safe]: durations.spatialFast },
		// transitionTimingFunction: { [motion.safe]: easings.spatialFast },
	},
	disabled: { backgroundImage: state.none, color: colors.onSurface38 },
})

const disabled = stylex.create({
	elevated: { backgroundColor: colors.onSurface12 },
	filled: { backgroundColor: colors.onSurface12 },
	tonal: { backgroundColor: colors.onSurface12 },
	outlined: {},
	text: {},
})

const shapes = { round, square }

interface ButtonProps extends Omit<Ariakit.ButtonProps, "style"> {
	size?: keyof typeof sizes
	shape?: keyof typeof shapes
	color?: keyof typeof variants
	style?: StyleXStyles
}

export function Button({
	size = "sm",
	shape = "round",
	color = "filled",
	style,
	...props
}: ButtonProps) {
	return (
		<Ariakit.Button
			accessibleWhenDisabled
			{...props}
			{...stylex.props(
				styles.button,
				sizes[size],
				variants[color],
				shapes[shape][size],
				props.disabled && styles.disabled,
				props.disabled && disabled[color],
				style
			)}
		/>
	)
}
