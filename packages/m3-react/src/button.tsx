import * as Ariakit from "@ariakit/react"
import { css, cva, type Styles } from "m3-styled-system/css"

export const button = cva({
	base: {
		"--size": "var(--size-sm)",
		"--size-xs": "var(--size,)",
		"--size-sm": "var(--size,)",
		"--size-md": "var(--size,)",
		"--size-lg": "var(--size,)",
		"--size-xl": "var(--size,)",
		height: `[
			var(--size-xs, 2rem)
			var(--size-sm, 2.5rem)
			var(--size-md, 3.5rem)
			var(--size-lg, 6rem)
			var(--size-xl, 8.5rem)
		]`,
		gap: `
			var(--size-xs, .25rem)
			var(--size-sm, .5rem)
			var(--size-md, .5rem)
			var(--size-lg, .75rem)
			var(--size-xl, 1rem)
		`,
		paddingInline: `
			var(--size-xs, .75rem)
			var(--size-sm, 1rem)		
			var(--size-md, 1.5rem)
			var(--size-lg, 3rem)
			var(--size-xl, 4rem)
		`,
		font: `
			var(--size-xs, var(--font-label-lg))
			var(--size-sm, var(--font-label-lg))
			var(--size-md, var(--font-title-md))
			var(--size-lg, var(--font-headline-sm))
			var(--size-xl, var(--font-headline-lg))
		`,
		letterSpacing: `
			var(--size-xs, var(--letter-spacing-label-lg))
			var(--size-sm, var(--letter-spacing-label-lg))
			var(--size-md, var(--letter-spacing-title-md))
			var(--size-lg, var(--letter-spacing-headline-sm))
			var(--size-xl, var(--letter-spacing-headline-lg))
		`,
		ring: `
			var(--size-xs, {ring.1})
			var(--size-sm, {ring.1})
			var(--size-md, {ring.2})
			var(--size-lg, {ring.3})
			var(--size-xl, {ring.3})
		`,
		display: "inline-flex",
		alignItems: "center",
		justifyContent: "center",
		whiteSpace: "nowrap",
		textBox: "trim-both cap alphabetic",
		state: {
			_hover: "hover",
			_focusVisible: { base: "focus", _hover: "focus" },
			_active: "pressed",
			_disabled: "none",
			'&[aria-disabled="true"]': "none",
		},
		_motionSafe: {
			transitionProperty: "border-radius",
			transitionDuration: "spatial.fast",
			transitionTimingFunction: "spatial.fast",
		},

		"--shape": "var(--shape-round)",
		"--shape-round": "var(--shape,)",
		"--shape-square": "var(--shape,)",
		borderRadius: {
			_active: `
				var(--size-xs, .5rem)
				var(--size-sm, .5rem)
				var(--size-md, .75rem)
				var(--size-lg, 1rem)
				var(--size-xl, 1rem)
			`,
			base: `
			var(--shape-round,
				var(--size-xs, 1rem)
				var(--size-sm, 1.25rem)
				var(--size-md, 1.75rem)
				var(--size-lg, 3rem)
				var(--size-xl, 4.25rem)
			)
			var(--shape-square,
				var(--size-xs, .75rem)
				var(--size-sm, .75rem)
				var(--size-md, 1rem)
				var(--size-lg, 1.75rem)
				var(--size-xl, 1.75rem)
			)
		`,
		},
	},

	variants: {
		color: {
			outlined: {
				ringColor: {
					base: "outline",
					_disabled: "outline-variant/12",
					'&[aria-disabled="true"]': "outline-variant/12",
				},
				ringInset: "inset",
				ring: 1,
				color: "on-surface-variant",
			},
			elevated: { backgroundColor: "surface-container-low", color: "primary" },
			filled: { backgroundColor: "primary", color: "on-primary" },
			text: { color: "primary" },
			tonal: {
				backgroundColor: "secondary-container",
				color: "on-secondary-container",
			},
		},
	},
	defaultVariants: { color: "filled" },
})

interface ButtonProps extends Ariakit.ButtonProps {
	size?: "xs" | "sm" | "md" | "lg" | "xl"
	css?: Styles
	shape?: "round" | "square"
}

export function Button({
	size = "sm",
	shape = "round",
	css: cssProp,
	color,
	...props
}: ButtonProps) {
	return (
		<Ariakit.Button
			type="button"
			{...props}
			className={css(button.raw({ color }), cssProp)}
			style={{
				...props.style,
				"--size": size && `var(--size-${size})`,
				"--shape": shape && `var(--shape-${shape})`,
			}}
		></Ariakit.Button>
	)
}
