import { utilities } from "@anitrove/design"
import colors from "@anitrove/design/colors"
import fonts, { letterSpacing, pxToRem } from "@anitrove/design/fonts"
import typography from "@tailwindcss/typography"
import type { Config } from "tailwindcss"
import plugin from "tailwindcss/plugin"
import { layout } from "./app/lib/layout"
import { list } from "./app/lib/list"
import { navigation } from "./app/lib/navigation"
import { numberToString } from "./app/lib/numberToString"
import * as Predicate from "./app/lib/Predicate"
import { searchView } from "./app/lib/searchView"

export const config = {
	content: ["app/**/*.{ts,tsx}"],

	plugins: [
		typography,

		plugin((ctx) => {
			ctx.addBase({
				"::backdrop": { fontSize: "16px" },
				":root": { fontSize: "16px" },
			})

			ctx.matchUtilities(
				{
					state: (opacity: number | string) => {
						const stateColor = `color-mix(in oklab, currentColor, transparent ${numberToString(
							100
								- Number(
									Predicate.isString(opacity)
										? opacity.replace("%", "")
										: opacity * 100
								)
						)}%)`

						return {
							backgroundImage: `linear-gradient(${stateColor}, ${stateColor})`,
						}
					},
				},
				{
					type: ["percentage"],
					values:
						(ctx.theme("state") as Record<string, string> | undefined) ?? {},
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
						return { "font-size": value }
					},
				},
				{
					values: Object.assign(
						Object.fromEntries(
							Object.entries<string>(
								(ctx.theme("spacing") as Record<string, string> | undefined)
									?? {}
							).filter(([key]) => 5 <= Number(key) && Number(key) <= 12)
						),
						{ DEFAULT: "1.5rem" }
					),
				}
			)

			ctx.matchUtilities(
				{ contrast: utilities.contrast },
				{
					type: ["any"],
					values: { high: "high", medium: "medium", standard: "standard" },
				}
			)

			ctx.matchUtilities(
				{ theme: utilities.theme },
				{ type: ["any"], values: { dark: "dark", light: "light" } }
			)

			ctx.addComponents({ ".i-inline": { "vertical-align": "-11.5%" } })
		}),
		searchView,
		layout,
		navigation,
		list,
	],
	theme: {
		borderRadius: {
			DEFAULT: "0.75rem",
			full: "9999px",
			inherit: "inherit",
			lg: "1rem",
			md: "0.75rem",
			none: "0",
			sm: "0.5rem",
			xl: "1.75rem",
			xs: "0.25rem",
		},
		colors: Object.assign(
			Object.fromEntries(
				Object.keys(colors.dark).map((key) => {
					return [key, `rgb(var(--${key}) / <alpha-value>)`]
				})
			),
			{ transparent: "transparent" }
		),
		extend: {
			animation: {
				"app-bar-large": "app-bar-large linear both",
				appear: "appear linear both",
			},
			keyframes: {
				"app-bar-large": { to: { height: "4rem", paddingBottom: "0.75rem" } },
				appear: {
					from: { opacity: "0", scale: ".8" },
					to: { opacity: "1", scale: "1" },
				},
			},
		},
		fontSize: Object.fromEntries(
			Object.entries(fonts).map(([key, value]) => [
				key,
				[
					pxToRem(value.fontSize),
					{
						fontWeight: value.fontWeight,
						letterSpacing: letterSpacing(value),
						lineHeight: value.lineHeight / value.fontSize,
					},
				],
			])
		),
		screens: { lg: "1200px", md: "840px", sm: "600px", xl: "1600px" },
		state: {
			dragged: "16%",
			focus: "10%",
			hover: "8%",
			none: "0",
			pressed: "10%",
		},
		transitionDuration: {
			effects: { DEFAULT: "200ms", fast: "150ms", slow: "300ms" },
			spatial: { DEFAULT: "500ms", fast: "350ms", slow: "650ms" },
		},
		transitionTimingFunction: {
			effects: {
				DEFAULT: "cubic-bezier(0.34, 0.80, 0.34, 1.00)",
				fast: "cubic-bezier(0.31, 0.94, 0.34, 1.00)",
				slow: "cubic-bezier(0.34, 0.88, 0.34, 1.00)",
			},
			spatial: {
				DEFAULT: "cubic-bezier(0.38, 1.21, 0.22, 1.00)",
				fast: "cubic-bezier(0.42, 1.67, 0.21, 0.9)",
				slow: "cubic-bezier(0.39, 1.29, 0.35, 0.98)",
			},
		},
	},
} as const satisfies Config

export default config
