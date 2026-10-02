import { createTV } from "tailwind-variants"

import { classGroups as searchView } from "./tailwind/search-view"
import { classGroups as navigation } from "./tailwind/navigation"
import { classGroups as list } from "./tailwind/list"
import fonts from "@animedes/design/fonts"

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
