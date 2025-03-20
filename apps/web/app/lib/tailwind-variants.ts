import { createTV } from "tailwind-variants"

// import colors from "~/../colors.json"
import fontSize from "~/../font-size.json"

export const tv = createTV({
	twMergeConfig: {
		theme: {
			// colors: Object.keys(colors.dark),
		},
		classGroups: {
			"font-size": [{ text: Object.keys(fontSize) }],
		},
	},
})
