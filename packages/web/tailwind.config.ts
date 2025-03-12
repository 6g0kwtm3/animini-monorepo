import typography from "@tailwindcss/typography"
import type { Config } from "tailwindcss"
import plugin from "tailwindcss/plugin"
import * as Predicate from "./app/lib/Predicate"
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
					return [`${key}`, `rgb(var(--${key}) / <alpha-value>)`]
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

		plugin(({ addBase, matchUtilities, theme }) => {
			addBase({
				":root": Object.assign({
					fontSize: "16px",
				}),
				"::backdrop": Object.assign({
					fontSize: "16px",
				}),
			})

			matchUtilities(
				{
					state: (opacity: string | number) => {
						const stateColor = `color-mix(in oklab, currentColor, transparent ${
							100 -
							Number(
								Predicate.isString(opacity)
									? opacity.replace("%", "")
									: Number(opacity) * 100
							)
						}%)`

						return {
							backgroundImage: `linear-gradient(${stateColor}, ${stateColor})`,
						}
					},
				},
				{
					values: theme("state") || {},
					type: ["percentage"],
				}
			)

			// matchUtilities(
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
			// 		values: flattenColorPalette(theme("colors")),
			// 		type: ["color", "any"]
			// 	}
			// )
		}),
		plugin(({ addVariant }) => {
			addVariant("error", [
				"&:has(:is(:user-invalid,:-moz-ui-invalid,:invalid))",
				"&:has([aria-invalid='true'])",
			])
			addVariant("focused", ["&[data-focus-visible]", "&:focus-visible"])
			addVariant("pressed", ["&[data-active]", "&:active"])
			addVariant("popover-open", ["&[data-open]", "&:popover-open"])

			// addVariant("dragged", [])
		}),
		plugin(({ addVariant }) => {
			addVariant("force", "&:not(\\#)")
		}),

		plugin(({ addComponents, matchUtilities, theme }) => {
			matchUtilities(
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
							Object.entries<string>(theme("spacing") || {}).filter(
								([key]) => 5 <= Number(key) && Number(key) <= 12
							)
						),
						{
							DEFAULT: "1.5rem",
						}
					),
				}
			)

			matchUtilities(
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

			matchUtilities(
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

			addComponents({
				".i-inline": {
					"vertical-align": "-11.5%",
				},
			})
		}),
	],
} as const satisfies Config

export default config
