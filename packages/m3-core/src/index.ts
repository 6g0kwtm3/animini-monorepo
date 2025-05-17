import { definePreset } from "@pandacss/dev"
import colors from "../../../apps/web/colors.json"
import fontSize from "../../../apps/web/tailwind.config.fonts"
import { buttonRecipe } from "./button.recipe"

export function numberToString(n: number): string {
	return String(n)
}

export const preset = definePreset({
	name: "m3-core",
	// Useful for theme customization
	theme: {
		extend: {
			textStyles: Object.fromEntries(
				Object.entries(fontSize).map(([key, [fontSize, value]]) => {
					return [key, { value: { ...value, fontSize } }]
				})
			),
			tokens: {
				colors: Object.assign(
					Object.fromEntries(
						Object.keys(colors.dark).map((key) => {
							return [key, { value: `rgb(var(--${key}) / <alpha-value>)` }]
						})
					)
				),
			},
			recipes: { button: buttonRecipe },
		},
	},

	utilities: {
		extend: {
			state: {
				values: {
					none: "0",
					hover: "8%",
					focus: "12%",
					pressed: "12%",
					dragged: "16%",
				},
				transform: (opacity: string) => {
					const stateColor = `color-mix(in oklab, transparent, currentColor ${
						typeof opacity === "string"
							? opacity
							: `${numberToString(Number(opacity) * 100)}%`
					})`

					return {
						backgroundImage: `linear-gradient(${stateColor}, ${stateColor})`,
					}
				},
			},
		},
	},
})
