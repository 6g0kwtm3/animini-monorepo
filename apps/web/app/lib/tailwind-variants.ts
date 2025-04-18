import { createTV } from "tailwind-variants"
import { classGroups as layout } from "~/lib/layout"
import { classGroups as searchView } from "~/lib/searchView"
import { classGroups as navigation } from "~/lib/navigation"
import { classGroups as list } from "~/lib/list"
// import colors from "~/../colors.json"
import fontSize from "~/../tailwind.config.fonts"

export const tv = createTV({
	twMergeConfig: {
		theme: {
			// colors: Object.keys(colors.dark),
		},
		classGroups: {
			"font-size": [{ text: Object.keys(fontSize) }],
			...searchView,
			...layout,
			...navigation,
			...list,
		},
	},
})
