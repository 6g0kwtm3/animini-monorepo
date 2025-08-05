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
		font: fonts.labelLg,
		gap: ".25rem",
		height: "2rem",
		letterSpacing: letterSpacings.labelLg,
		paddingInline: ".75rem",
	},
	sm: {
		font: fonts.labelLg,
		gap: ".5rem",
		height: "2.5rem",
		letterSpacing: letterSpacings.labelLg,
		paddingInline: "1rem",
	},
	md: {
		font: fonts.titleMd,
		gap: ".5rem",
		height: "3.5rem",
		letterSpacing: letterSpacings.titleMd,
		paddingInline: "1.5rem",
	},
	lg: {
		font: fonts.headlineSm,
		gap: ".75rem",
		height: "6rem",
		letterSpacing: letterSpacings.headlineSm,
		paddingInline: "3rem",
	},
	xl: {
		font: fonts.headlineLg,
		gap: "1rem",
		height: "8.5rem",
		letterSpacing: letterSpacings.headlineLg,
		paddingInline: "4rem",
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

const round = stylex.create({})

const square = stylex.create({})

const styles = stylex.create({
	button: {
		alignItems: "center",
		backgroundImage: {
			":hover": { default: state.hover, ":focus-visible": state.focus },
			":focus-visible": state.focus,
			":active": state.pressed,
		},
		display: "inline-flex",
		justifyContent: "center",
		textBox: "trim-both cap alphabetic",
		transition: {
			[motion.safe]: `border-radius ${durations.spatialFast} ${easings.spatialFast}`,
		},
		whiteSpace: "nowrap",
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
