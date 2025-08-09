import { numberToString } from "utilities"
import { type Value, mapValue } from "unstyled/value"
export * as utilities from "./design-utilities"
export * as tokens from "./design-tokens"

const states = { none: 0, hover: 0.08, focus: 0.1, pressed: 0.1, dragged: 0.16 }

export const state = (value: Value<keyof typeof states>) => {
	const stateColor = `color-mix(in oklab, currentColor, transparent var(--state))`

	return {
		backgroundImage: `linear-gradient(${stateColor}, ${stateColor})`,
		"--state": mapValue(value, (value) => {
			const opacity = states[value]

			return `${numberToString(100 - opacity * 100)}%`
		}),
	}
}

export const media = {
	motionSafe: "@media (prefers-reduced-motion: no-preference)",
	hover: "&:hover",
	"focus-visible": "&:focus-visible, &[data-focus-visible]",
	active: "&:active, &[data-active]",
	disabled: '&:disabled, &[aria-disabled="true"]',
	sm: "@media (width >= 600px)",
	md: "@media (width >= 840px)",
	lg: "@media (width >= 1200px)",
	xl: "@media (width >= 1600px)",
	maxSm: "@media (width < 600px)",
	maxMd: "@media (width < 840px)",
	maxLg: "@media (width < 1200px)",
	maxXl: "@media (width < 1600px)",
} as const
