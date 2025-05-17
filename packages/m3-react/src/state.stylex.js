import * as stylex from "@stylexjs/stylex"
export const state = stylex.defineVars({
	none: null,
	hover:
		"linear-gradient(color-mix(in oklab, currentColor, transparent 92%), color-mix(in oklab, currentColor, transparent 92%))",
	focus:
		"linear-gradient(color-mix(in oklab, currentColor, transparent 88%), color-mix(in oklab, currentColor, transparent 88%))",
	pressed:
		"linear-gradient(color-mix(in oklab, currentColor, transparent 88%), color-mix(in oklab, currentColor, transparent 88%))",
	dragged:
		"linear-gradient(color-mix(in oklab, currentColor, transparent 84%), color-mix(in oklab, currentColor, transparent 84%))",
})
