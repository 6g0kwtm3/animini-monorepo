import { definePreset } from "@pandacss/dev"
import colors from "../../../apps/web/colors.json"
import fontSize from "../../../apps/web/tailwind.config.fonts"
import { buttonRecipe } from "./button.recipe"

export function numberToString(n: number): string {
	return String(n)
}

const ring = {
	"--tw-shadow": { syntax: "*", inherits: false, "initialValue": "0 0 #0000" },
	"--tw-shadow-color": { syntax: "*", inherits: false },
	"--tw-shadow-alpha": {
		syntax: "<percentage>",
		inherits: false,
		"initialValue": "100%",
	},
	"--tw-inset-shadow": {
		syntax: "*",
		inherits: false,
		"initialValue": "0 0 #0000",
	},
	"--tw-inset-shadow-color": { syntax: "*", inherits: false },
	"--tw-inset-shadow-alpha": {
		syntax: "<percentage>",
		inherits: false,
		"initialValue": "100%",
	},
	"--tw-ring-color": { syntax: "*", inherits: false },
	"--tw-ring-shadow": {
		syntax: "*",
		inherits: false,
		"initialValue": "0 0 #0000",
	},
	"--tw-inset-ring-color": { syntax: "*", inherits: false },
	"--tw-inset-ring-shadow": {
		syntax: "*",
		inherits: false,
		"initialValue": "0 0 #0000",
	},
	"--tw-ring-inset": { syntax: "*", inherits: false },
	"--tw-ring-offset-width": {
		syntax: "<length>",
		inherits: false,
		"initialValue": "0px",
	},
	"--tw-ring-offset-color": {
		syntax: "*",
		inherits: false,
		"initialValue": "#fff",
	},
	"--tw-ring-offset-shadow": {
		syntax: "*",
		inherits: false,
		"initialValue": "0 0 #0000",
	},
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
