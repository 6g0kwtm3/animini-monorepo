import { type Properties, type RawStyles } from "@anitrove/unstyled"

import type Colors from "./design-colors"
import fonts, { letterSpacing, pxToRem } from "./design-fonts"

export const borderRadius = {
	none: "0",
	xs: "0.25rem",
	sm: "0.5rem",
	md: "0.75rem",
	DEFAULT: "0.75rem",
	lg: "1rem",
	xl: "1.75rem",
	full: "9999px",
	inherit: "inherit",
} as const satisfies Record<string, Properties["borderRadius"]>

export const colors = new Proxy(
	{},
	{
		get: (target, key: string) => {
			const [color, opacity] = key.split("/")
			if (color !== undefined && opacity !== undefined) {
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
) as unknown as Record<keyof typeof fonts, RawStyles>

export const transitions = {
	spatial: {
		fast: {
			transitionTimingFunction: "cubic-bezier(0.42, 1.67, 0.21, 0.9)",
			transitionDuration: "350ms",
		},
		DEFAULT: {
			transitionTimingFunction: "cubic-bezier(0.38, 1.21, 0.22, 1.00)",
			transitionDuration: "500ms",
		},
		slow: {
			transitionTimingFunction: "cubic-bezier(0.39, 1.29, 0.35, 0.98)",
			transitionDuration: "650ms",
		},
	},
	effects: {
		fast: {
			transitionTimingFunction: "cubic-bezier(0.31, 0.94, 0.34, 1.00)",
			transitionDuration: "150ms",
		},
		DEFAULT: {
			transitionTimingFunction: "cubic-bezier(0.34, 0.80, 0.34, 1.00)",
			transitionDuration: "200ms",
		},
		slow: {
			transitionTimingFunction: "cubic-bezier(0.34, 0.88, 0.34, 1.00)",
			transitionDuration: "300ms",
		},
	},
} as const satisfies Record<string, Record<string, RawStyles>>
