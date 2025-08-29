import { numberToString } from "utilities"
import { type Value, mapValue } from "@anitrove/unstyled/value"
export * as utilities from "./design-utilities"
export * as tokens from "./design-tokens"

const states = { dragged: 0.16, focus: 0.1, hover: 0.08, none: 0, pressed: 0.1 }

export const state = (value: Value<keyof typeof states>) => {
	const stateColor = `color-mix(in oklab, currentColor, transparent var(--state))`

	return {
		"--state": mapValue(value, (value) => {
			const opacity = states[value]

			return `${numberToString(100 - opacity * 100)}%`
		}),
		backgroundImage: `linear-gradient(${stateColor}, ${stateColor})`,
	}
}

export const media = {
	active: "&:active, &[data-active]",
	disabled: '&:disabled, &[aria-disabled="true"]',
	"focus-visible": "&:focus-visible, &[data-focus-visible]",
	hover: "&:hover",
	lg: "@media (width >= 1200px)",
	maxLg: "@media (width < 1200px)",
	maxMd: "@media (width < 840px)",
	maxSm: "@media (width < 600px)",
	maxXl: "@media (width < 1600px)",
	md: "@media (width >= 840px)",
	motionSafe: "@media (prefers-reduced-motion: no-preference)",
	sm: "@media (width >= 600px)",
	xl: "@media (width >= 1600px)",
} as const
