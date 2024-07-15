import { createContext } from "react"
import { tv } from "./tailwind-variants"

export const createList = tv(
	{
		slots: {
			root: "py-2",
			item: "group flex gap-x-4 px-4 hover:state-hover focus-visible:state-focus data-[active-item]:state-focus data-[focus-visible]:state-focus",
			itemAvatar:
				"h-10 w-10 shrink-0 overflow-hidden rounded-full *:h-full *:w-full",
			itemImg: "h-14 w-14 shrink-0 overflow-hidden *:h-full *:w-full",
			itemIcon: "i",
			itemContent: "-mx-4 flex h-full flex-1 flex-col truncate px-4",
			itemTitle: "truncate text-body-lg text-on-surface",
			itemSubtitle: "text-body-md text-on-surface-variant",
			trailingSupportingText: "text-label-sm text-on-surface-variant",
		},
		variants: {
			lines: {
				one: {
					root: "",
					item: "min-h-[3.5rem] items-center",
					itemSubtitle: "hidden",
					itemContent: "justify-center py-2",
				},
				two: {
					root: "",
					item: "min-h-[4.5rem] items-center",
					itemSubtitle: "block truncate",
					itemContent: "justify-center py-2",
				},
				three: {
					root: "",
					item: "min-h-[5.5rem] items-start",
					itemSubtitle: "line-clamp-2",
					itemContent: "justify-start py-3",
				},
			},
		},
		defaultVariants: {
			lines: "two",
		},
	},
	{
		responsiveVariants: ["sm"],
	}
)

export const ListContext = createContext(createList())
