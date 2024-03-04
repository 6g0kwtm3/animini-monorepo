import type { Config } from "tailwindcss"
//@ts-ignore
//@ts-ignore
import { withTV } from "tailwind-variants/transformer"
//@ts-ignore
import { Predicate } from "effect"
import plugin from "tailwindcss/plugin"
import colors from "./colors.json"
import { Predicate } from "effect"

const K_1 = 0.173
const K_2 = 0.004
const K_3 = (1.0 + K_1) / (1.0 + K_2)

function toeInv(x: number): number {
	return (x ** 2 + K_1 * x) / (K_3 * (x + K_2))
}

export default withTV({
	content: ["app/**/*.{ts,tsx,mdx}", ".ladle/components.tsx"],

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
					return [`${key}`, `oklch(from var(--${key}) l c h / <alpha-value>)`]
				})
			),
			{ transparent: "transparent" }
		),
		extend: {}
	},
	plugins: [
		require("@tailwindcss/typography"),
		require("@tailwindcss/container-queries"),

		plugin(
			({ addUtilities, matchComponents, addBase, matchUtilities, theme }) => {
				addBase({
					":root": Object.assign({
						fontSize: "16px"
					}),
					"::backdrop": Object.assign({
						fontSize: "16px"
					}),
					"@media (prefers-color-scheme: dark)": {
						":root": Object.assign({
							"color-scheme": "light dark"
						}),
						"::backdrop": Object.assign({ "color-scheme": "light dark" })
					}
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
			addVariant("has-focused", [
				"&:has([data-focus-visible])",
				"&:has(:focus-visible)"
			])
			addVariant("pressed", ["&[data-active]", "&:active"])
			addVariant("group-focused", [
				":merge(.group)[data-focus-visible] &",
				":merge(.group):focus-visible &"
			])
			addVariant("group-has-focused", [
				":merge(.group):has([data-focus-visible]) &",
				":merge(.group):has(:focus-visible) &"
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
							`--${key}`,
							`oklch(from var(--theme-${token}) ${toeInv(Number(tone) / 100)} c h)`
						]
					})
				)

			matchUtilities(
				{
					"palette-content": (value) => {
						return {
							"--theme-primary": `oklch(from ${value} l c h)`,
							"--theme-secondary": `oklch(from ${value} ${toeInv(50 / 100)} calc(c / 3) h)`,
							"--theme-tertiary": `oklch(from ${value} ${toeInv(50 / 100)} calc(c / 2) calc(h + 60))`,
							"--theme-neutral": `oklch(from ${value} ${toeInv(50 / 100)} min(calc(c / 12), 0.013333333333333334) h)`,
							"--theme-neutral-variant": `oklch(from ${value} ${toeInv(50 / 100)} min(calc(c / 6), 0.02666666666666667) h)`,
							"--theme-error": `oklch(${toeInv(50 / 100)} 0.08333333333333334 25)`
						}
					},
					palette: (value) => {
						return {
							"--theme-primary": `oklch(from ${value} ${toeInv(50 / 100)} max(c, 0.16) h)`,
							"--theme-secondary": `oklch(from ${value} ${toeInv(50 / 100)} 0.05333333333333334 h)`,
							"--theme-tertiary": `oklch(from ${value} ${toeInv(50 / 100)} 0.08 calc(h + 60))`,
							"--theme-neutral": `oklch(from ${value} ${toeInv(50 / 100)} 0.013333333333333334 h)`,
							"--theme-neutral-variant": `oklch(from ${value} ${toeInv(50 / 100)} 0.02666666666666667 h)`,
							"--theme-error": `oklch(${toeInv(50 / 100)} 0.08333333333333334 25)`
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
