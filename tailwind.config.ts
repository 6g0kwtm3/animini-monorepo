import type { Config } from "tailwindcss"
//@ts-ignore
//@ts-ignore
import { withTV } from "tailwind-variants/transformer"
//@ts-ignore
import { Predicate } from "effect"
import plugin from "tailwindcss/plugin"
import colors from "./colors.json"

const K_1 = 0.173
const K_2 = 0.004
const K_3 = (1.0 + K_1) / (1.0 + K_2)

function toeInv(x: number): number {
	return (x ** 2 + K_1 * x) / (K_3 * (x + K_2))
}

export default withTV({
	content: ["app/**/*.{ts,tsx}"],

	theme: {
		screens: {
			sm: "600px",
			md: "840px",
			lg: "1200px",
			xl: "1600px"
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
			inherit: "inherit"
		},
		state: {
			none: "0",
			hover: "8%",
			focus: "12%",
			pressed: "12%",
			dragged: "16%"
		},
		fontSize: {
			"display-lg": [
				"3.5625rem",
				{
					lineHeight: "1.1228070175438596",
					letterSpacing: "0",
					fontWeight: 400
				}
			],
			"display-md": [
				"2.8125rem",
				{
					lineHeight: "1.1555555555555554",
					letterSpacing: "0",
					fontWeight: 400
				}
			],
			"display-sm": [
				"2.25rem",
				{
					lineHeight: "1.2222222222222223",
					letterSpacing: "0",
					fontWeight: 400
				}
			],
			"headline-lg": [
				"2rem",
				{ lineHeight: "1.25", letterSpacing: "0", fontWeight: 400 }
			],
			"headline-md": [
				"1.75rem",
				{
					lineHeight: "1.2857142857142858",
					letterSpacing: "0",
					fontWeight: 400
				}
			],
			"headline-sm": [
				"1.5rem",
				{
					lineHeight: "1.3333333333333333",
					letterSpacing: "0",
					fontWeight: 400
				}
			],
			"title-lg": [
				"1.375rem",
				{
					lineHeight: "1.2727272727272727",
					letterSpacing: "0",
					fontWeight: 400
				}
			],
			"title-md": [
				"1rem",
				{ lineHeight: "1.5", letterSpacing: "0.009375em", fontWeight: 500 }
			],
			"title-sm": [
				"0.875rem",
				{
					lineHeight: "1.4285714285714286",
					letterSpacing: "0.0071428571428571435em",
					fontWeight: 500
				}
			],
			"label-lg": [
				"0.875rem",
				{
					lineHeight: "1.4285714285714286",
					letterSpacing: "0.0071428571428571435em",
					fontWeight: 500
				}
			],
			"label-md": [
				"0.75rem",
				{
					lineHeight: "1.3333333333333333",
					letterSpacing: "0.041666666666666664em",
					fontWeight: 500
				}
			],
			"label-sm": [
				"0.6875rem",
				{
					lineHeight: "1.6666666666666667",
					letterSpacing: "0.03125rem",
					fontWeight: 500
				}
			],
			"body-lg": [
				"1rem",
				{ lineHeight: "1.5", letterSpacing: "0.03125rem", fontWeight: 400 }
			],
			"body-md": [
				"0.875rem",
				{
					lineHeight: "1.4285714285714286",
					letterSpacing: "0.017857142857142856em",
					fontWeight: 400
				}
			],
			"body-sm": [
				"0.75rem",
				{
					lineHeight: "1.3333333333333333",
					letterSpacing: "0.03333333333333333em",
					fontWeight: 400
				}
			]
		},
		colors: Object.assign(
			Object.fromEntries(
				Object.entries(colors.dark).map(([key, value]) => {
					return [
						`${key}`,
						`oklch(from var(--m3-${key}) l c h / <alpha-value>)`
					]
				})
			),
			{ transparent: "transparent" }
		),
		extend: {
			transitionTimingFunction: {
				emphasized: "cubic-bezier(0.2, 0.0, 0, 1.0)",
				"emphasized-decelerate": "cubic-bezier(0.05, 0.7, 0.1, 1.0)",
				"emphasized-accelerate": "cubic-bezier(0.3, 0.0, 0.8, 0.15)",
				standard: "cubic-bezier(0.2, 0.0, 0, 1.0)",
				"standard-decelerate": "cubic-bezier(0, 0, 0, 1)",
				"standard-accelerate": "cubic-bezier(0.3, 0.0, 1, 1)"
			},
			transitionDuration: {
				"sm-1": "50ms",
				"sm-2": "100ms",
				"sm-3": "150ms",
				"sm-4": "200ms",
				"md-1": "250ms",
				"md-2": "300ms",
				"md-3": "350ms",
				"md-4": "400ms",
				"lg-1": "450ms",
				"lg-2": "500ms",
				"lg-3": "550ms",
				"lg-4": "600ms",
				"xl-1": "700ms",
				"xl-2": "700ms",
				"xl-3": "800ms",
				"xl-4": "1000ms"
			}
		}
	},
	plugins: [
		require("@tailwindcss/container-queries"),
		require("@tailwindcss/typography"),

		plugin(
			({ addUtilities, matchComponents, addBase, matchUtilities, theme }) => {
				addBase({
					":root": Object.assign({
						fontSize: "16px"
					}),
					"::backdrop": Object.assign({
						fontSize: "16px"
					})
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
								backgroundImage: `linear-gradient(${stateColor}, ${stateColor})`
							}
						}
					},
					{
						values: theme("state") || {},
						type: ["percentage"]
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
			}
		),
		plugin(({ addUtilities }) => {}),
		plugin(({ matchVariant }) => {}),
		plugin(({ addComponents, matchComponents, addVariant, matchVariant }) => {
			matchComponents({}, {})

			addVariant("error", [
				"&:has(:is(:user-invalid,:-moz-ui-invalid,:invalid))",
				"&:has([aria-invalid='true'])"
			])
			addVariant("group-error", [
				":merge(.group):has(:is(:user-invalid,:-moz-ui-invalid,:invalid)) &",
				":merge(.group):has([aria-invalid='true']) &"
			])
			addVariant("focused", ["&[data-focus-visible]", "&:focus-visible"])
			addVariant("pressed", ["&[data-active]", "&:active"])
			addVariant("group-focused", [
				":merge(.group)[data-focus-visible] &",
				":merge(.group):focus-visible &"
			])
			addVariant("group-pressed", [
				":merge(.group)[data-active] &",
				":merge(.group):active &"
			])
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
							"font-size": value
						}
					}
				},
				{
					values: Object.assign(
						Object.fromEntries(
							Object.entries(theme("spacing") || {}).filter(
								([key]) => 5 <= Number(key) && Number(key) <= 12
							)
						),
						{
							DEFAULT: "1.5rem"
						}
					)
				}
			)

			const themeColors = (theme: (typeof colors)["dark" | "light"]) =>
				Object.fromEntries(
					Object.entries(theme).map(([key, value]) => {
						const [token = "", tone] = value
							.replaceAll(/(\d+)$/g, "_$1")
							.split("_")

						return [
							`--m3-${key}`,
							`oklch(from var(--m3-palette-${token}) ${toeInv(Number(tone) / 100)} c h)`
						]
					})
				)

			matchUtilities(
				{
					palette: (value) => {
						return {
							"--m3-palette-primary": `oklch(from ${value} ${toeInv(50 / 100)} ${chroma(36)} h)`,
							"--m3-palette-secondary": `oklch(from ${value} ${toeInv(50 / 100)} ${chroma(16)} h)`,
							"--m3-palette-tertiary": `oklch(from ${value} ${toeInv(50 / 100)} ${chroma(24)} calc(h + 60))`,
							"--m3-palette-neutral": `oklch(from ${value} ${toeInv(50 / 100)} ${chroma(6)} h)`,
							"--m3-palette-neutral-variant": `oklch(from ${value} ${toeInv(50 / 100)} ${chroma(8)} h)`,
							"--m3-palette-error": `oklch(${toeInv(50 / 100)} ${chroma(84)} 25)`
						}
					}
				},
				{
					type: ["color", "any"]
				}
			)

			addComponents({
				".theme-dark": themeColors(colors.dark),
				".theme-light": themeColors(colors.light)
			})

			addComponents({
				".i-inline": {
					"vertical-align": "-11.5%"
				}
			})
		})
	]
} satisfies Config)

function chroma(chroma: number) {
	return (chroma / 120) * 0.4
}
