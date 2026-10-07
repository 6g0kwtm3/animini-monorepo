import fonts from "@animedes/design/fonts"
import { createTV } from "tailwind-variants"

import { classGroups as list } from "./tailwind/list"
import { classGroups as navigation } from "./tailwind/navigation"
import { classGroups as searchView } from "./tailwind/search-view"

export const tv = createTV({
	twMergeConfig: {
		theme: {
			// colors: Object.keys(colors.dark),
		},
		classGroups: {
			"font-size": [{ text: Object.keys(fonts) }],
			...searchView,

			...navigation,
			...list,
		},
	},
})
