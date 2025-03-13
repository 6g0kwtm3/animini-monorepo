import { createTV, type CreateTV } from "tailwind-variants"

// import colors from "~/../colors.json"
import { fonts } from "./fonts"

export const tv: CreateTV = createTV({
	twMergeConfig: {
		theme: {
			// colors: Object.keys(colors.dark),
		},
		classGroups: {
			"font-size": [{ text: Object.keys(fonts) }],
		},
	},
})
