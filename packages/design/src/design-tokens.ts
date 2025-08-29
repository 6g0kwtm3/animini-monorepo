import { type Properties, type RawStyles } from "@anitrove/unstyled"

import type Colors from "./design-colors"
import fonts, { letterSpacing, pxToRem } from "./design-fonts"

export const borderRadius = {
	DEFAULT: "0.75rem",
	full: "9999px",
	inherit: "inherit",
	lg: "1rem",
	md: "0.75rem",
	none: "0",
	sm: "0.5rem",
	xl: "1.75rem",
	xs: "0.25rem",
} as const satisfies Record<string, Properties["borderRadius"]>

export const colors = new Proxy(
	{},
	{
		get: (target, key: string) => {
			const [color, opacity] = key.split("/")
			if (color && opacity) {
				return `rgb(var(--${color}) / ${opacity}%)`
			}
			return `rgb(var(--${key}))`
		},
	}
) as unknown as Record<
	`${keyof typeof Colors.dark}/${number}` | keyof typeof Colors.dark,
	string
>

export const typescale = Object.fromEntries(
	Object.entries(fonts).map(
		([key, value]): [
			keyof typeof fonts,
			{
				fontSize: string
				fontWeight: number
				letterSpacing: string
				lineHeight: number
			},
		] => [
			key as keyof typeof fonts,
			{
				fontSize: pxToRem(value.fontSize),
				fontWeight: value.fontWeight,
				letterSpacing: letterSpacing(value),
				lineHeight: value.lineHeight / value.fontSize,
			},
		]
	)
)

export const transitions = {
	effects: {
		DEFAULT: {
			transitionDuration: "200ms",
			transitionTimingFunction: "cubic-bezier(0.34, 0.80, 0.34, 1.00)",
		},
		fast: {
			transitionDuration: "150ms",
			transitionTimingFunction: "cubic-bezier(0.31, 0.94, 0.34, 1.00)",
		},
		slow: {
			transitionDuration: "300ms",
			transitionTimingFunction: "cubic-bezier(0.34, 0.88, 0.34, 1.00)",
		},
	},
	spatial: {
		DEFAULT: {
			transitionDuration: "500ms",
			transitionTimingFunction: "cubic-bezier(0.38, 1.21, 0.22, 1.00)",
		},
		fast: {
			transitionDuration: "350ms",
			transitionTimingFunction: "cubic-bezier(0.42, 1.67, 0.21, 0.9)",
		},
		slow: {
			transitionDuration: "650ms",
			transitionTimingFunction: "cubic-bezier(0.39, 1.29, 0.35, 0.98)",
		},
	},
} as const satisfies Record<string, Record<string, RawStyles>>
