import * as stylex from "@stylexjs/stylex"

const sizes = stylex.create({
	xs: { paddingInline: ".75rem" },
	sm: { paddingInline: "1rem" },
	md: {},
	lg: {},
	xl: {},
})

const colors = stylex.create({
	elevated: {},
	filled: {},
	tonal: {},
	outlined: {},
	text: {},
})

const shapes = stylex.create({ round: {}, square: {} })

const styles = stylex.create({
	button: {
		backgroundImage: {
			default: null,
			":hover": state.hover,
			":focus-visible": state.focus,
			":is([data-focus-visible])": state.focus,
			":active": state.pressed,
		},
	},
	disabled: { backgroundImage: state.none },
})

import * as Ariakit from "@ariakit/react"
import type { StyleXStyles } from "@stylexjs/stylex"
import { state } from "./state.stylex"

interface ButtonProps extends Omit<Ariakit.ButtonProps, "style"> {
	size?: keyof typeof sizes
	shape?: keyof typeof shapes
	color?: keyof typeof colors
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
				shapes[shape],
				colors[color],
				style,
				props.disabled && styles.disabled
			)}
		/>
	)
}
