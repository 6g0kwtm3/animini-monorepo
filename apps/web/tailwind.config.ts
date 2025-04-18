import typography from "@tailwindcss/typography"
import type { Config } from "tailwindcss"
import plugin from "tailwindcss/plugin"
import { layout } from "./app/lib/layout"
import { navigation } from "./app/lib/navigation"
import { list } from "./app/lib/list"
import { numberToString } from "./app/lib/numberToString"
import * as Predicate from "./app/lib/Predicate"
import { searchView } from "./app/lib/searchView"
import colors from "./colors.json"
import fontSize from "./tailwind.config.fonts"
export const config = {
	content: ["app/**/*.{ts,tsx}"],

	theme: {
		screens: {
			sm: "600px",
			md: "840px",
			lg: "1200px",
			xl: "1600px",
		},
		borderRadius: {
			none: "0",
			xs: "0.25rem",
			sm: "0.5rem",
			md: "0.75rem",
			DEFAULT: "0.75rem",
			lg: "1rem",
			xl: "1.75rem",
			full: "9999px",
			inherit: "inherit",
		},
		state: {
			none: "0",
			hover: "8%",
			focus: "12%",
			pressed: "12%",
			dragged: "16%",
		},
		fontSize,
		colors: Object.assign(
			Object.fromEntries(
				Object.keys(colors.dark).map((key) => {
					return [key, `rgb(var(--${key}) / <alpha-value>)`]
				})
			),
			{ transparent: "transparent" }
		),
		transitionTimingFunction: {
			emphasized: "cubic-bezier(0.2, 0.0, 0, 1.0)",
			"emphasized-decelerate": "cubic-bezier(0.05, 0.7, 0.1, 1.0)",
			"emphasized-accelerate": "cubic-bezier(0.3, 0.0, 0.8, 0.15)",
			standard: "cubic-bezier(0.2, 0.0, 0, 1.0)",
			"standard-decelerate": "cubic-bezier(0, 0, 0, 1)",
			"standard-accelerate": "cubic-bezier(0.3, 0.0, 1, 1)",
		},
		transitionDuration: {
			sm: "50ms",
			"2sm": "100ms",
			"3sm": "150ms",
			"4sm": "200ms",
			md: "250ms",
			"2md": "300ms",
			"3md": "350ms",
			"4md": "400ms",
			lg: "450ms",
			"2lg": "500ms",
			"3lg": "550ms",
			"4lg": "600ms",
			xl: "700ms",
			"2xl": "700ms",
			"3xl": "800ms",
			"4xl": "1000ms",
		},
		extend: {
			animation: {
				appear: "appear linear both",
				"app-bar-large": "app-bar-large linear both",
			},
			keyframes: {
				appear: {
					from: { opacity: "0", scale: ".8" },
					to: { opacity: "1", scale: "1" },
				},
				"app-bar-large": {
					to: { height: "4rem", paddingBottom: "0.75rem" },
				},
			},
		},
	},
	plugins: [
		typography,

		plugin((ctx) => {
			ctx.addBase({
				":root": {
					fontSize: "16px",
				},
				"::backdrop": {
					fontSize: "16px",
				},
			})

			ctx.matchUtilities(
				{
					state: (opacity: string | number) => {
						const stateColor = `color-mix(in oklab, currentColor, transparent ${numberToString(
							100 -
								Number(
									Predicate.isString(opacity)
										? opacity.replace("%", "")
										: Number(opacity) * 100
								)
						)}%)`

						return {
							backgroundImage: `linear-gradient(${stateColor}, ${stateColor})`,
						}
					},
				},
				{
					values:
						(ctx.theme("state") as Record<string, string> | undefined) ?? {},
					type: ["percentage"],
				}
			)

			// ctx.matchUtilities(
			// 	{
			// 		state: (color) => ({
			// 			...withAlphaVariable({
			// 				color: "currentColor",
			// 				property: "--mdi-state-color",
			// 				variable: "--mdi-state-opacity"
			// 			}),
			// 			"--mdi-state-opacity": undefined,
			// 			backgroundImage
			// 		})
			// 	},
			// 	{
			// 		values: flattenColorPalette(ctx.theme("colors")),
			// 		type: ["color", "any"]
			// 	}
			// )
		}),
		plugin((ctx) => {
			ctx.addVariant("error", [
				"&:has(:is(:user-invalid,:-moz-ui-invalid,:invalid))",
				"&:has([aria-invalid='true'])",
			])
			ctx.addVariant("focused", ["&[data-focus-visible]", "&:focus-visible"])
			ctx.addVariant("pressed", ["&[data-active]", "&:active"])
			ctx.addVariant("popover-open", ["&[data-open]", "&:popover-open"])

			// ctx.addVariant("dragged", [])
		}),
		plugin((ctx) => {
			ctx.addVariant("force", "&:not(\\#)")
		}),

		plugin((ctx) => {
			ctx.matchUtilities(
				{
					i: (value) => {
						return {
							"font-size": value,
						}
					},
				},
				{
					values: Object.assign(
						Object.fromEntries(
							Object.entries<string>(
								(ctx.theme("spacing") as Record<string, string> | undefined) ??
									{}
							).filter(([key]) => 5 <= Number(key) && Number(key) <= 12)
						),
						{
							DEFAULT: "1.5rem",
						}
					),
				}
			)

			ctx.matchUtilities(
				{
					contrast: (value) => {
						return Object.fromEntries(
							Object.keys(colors.dark).flatMap((key) => {
								return [
									[`--${key}-light`, `var(--${key}-light-${value})`],
									[`--${key}-dark`, `var(--${key}-dark-${value})`],
								]
							})
						)
					},
				},
				{
					type: ["any"],
					values: {
						high: "high",
						medium: "medium",
						standard: "standard",
					},
				}
			)

			ctx.matchUtilities(
				{
					theme: (value) => {
						return Object.fromEntries(
							Object.keys(colors.dark).map((key) => {
								return [`--${key}`, `var(--${key}-${value})`]
							})
						)
					},
				},
				{
					type: ["any"],
					values: {
						dark: "dark",
						light: "light",
					},
				}
			)

			ctx.addComponents({
				".i-inline": {
					"vertical-align": "-11.5%",
				},
			})
		}),
		searchView,
		layout,
		navigation,
		list,
	],
} as const satisfies Config

export default config
