import { defineGlobalStyles, definePreset, defineTokens } from "@pandacss/dev"
import colors from "../../../apps/web/colors.json"
import fontSize from "../../../apps/web/tailwind.config.fonts"
import { button } from "./button.recipe"

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
	globalVars: { ...ring },
	globalCss: defineGlobalStyles({
		html: {
			"--global-font-body": 'Roboto, "Roboto Flex", sans-serif',
			"--global-font-mono": '"Roboto Mono", monospace',
			fontOpticalSizing: "auto",
		},
	}),
	name: "m3-core",
	// Useful for theme customization
	theme: {
		tokens: defineTokens({
			easings: {
				spatial: {
					fast: { value: "cubic-bezier(0.42, 1.67, 0.21, 0.9)" },
					DEFAULT: { value: "cubic-bezier(0.38, 1.21, 0.22, 1.00)" },
					slow: { value: "cubic-bezier(0.39, 1.29, 0.35, 0.98)" },
				},
				effects: {
					fast: { value: "cubic-bezier(0.31, 0.94, 0.34, 1.00)" },
					DEFAULT: { value: "cubic-bezier(0.34, 0.80, 0.34, 1.00)" },
					slow: { value: "cubic-bezier(0.34, 0.88, 0.34, 1.00)" },
				},
			},
			durations: {
				spatial: {
					fast: { value: "350ms" },
					DEFAULT: { value: "500ms" },
					slow: { value: "650ms" },
				},
				effects: {
					fast: { value: "150ms" },
					DEFAULT: { value: "200ms" },
					slow: { value: "300ms" },
				},
			},
		}),
		textStyles: Object.fromEntries(
			Object.entries(fontSize).map(([key, [fontSize, value]]) => {
				return [key, { value: { ...value, fontSize } }]
			})
		),
		semanticTokens: {
			colors: Object.assign(
				Object.fromEntries(
					Object.keys(colors.dark).map((key) => {
						return [key, { value: `rgb(var(--${key}))` }]
					})
				)
			),
		},
		recipes: { button: button },
	},

	utilities: {
		extend: {
			ringColor: {
				values: "colors",
				transform(value) {
					return { "--tw-ring-color": value }
				},
			},
			ringInset: {
				values: ["inset"],
				transform(value) {
					return { "--tw-ring-inset": value }
				},
			},
			ring: {
				values: { type: "number" },
				transform(value) {
					return {
						"--tw-ring-shadow":
							"var(--tw-ring-inset,) 0 0 0 calc("
							+ value
							+ "px + var(--tw-ring-offset-width)) var(--tw-ring-color, currentcolor)",
						boxShadow:
							"var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow)",
					}
				},
			},
			theme: {
				values: ["light", "dark"],
				transform: (value) => {
					return {
						colorScheme: value,
						...Object.fromEntries(
							Object.keys(colors.dark).map((key) => {
								return [`--colors-${key}`, `rgb(var(--${key}-${value}))`]
							})
						),
					}
				},
			},
			contrast: {
				values: { high: "high", medium: "medium", standard: "standard" },
				transform(value) {
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
			state: {
				values: {
					none: "0",
					hover: "8%",
					focus: "10%",
					pressed: "10%",
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
