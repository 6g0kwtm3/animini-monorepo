import { tv } from "~/lib/tailwind-variants"

export const createList = tv(
	{
		slots: {
			root: "grid grid-cols-[auto_minmax(0,1fr)_auto] gap-x-4",
			item: "hover:state-hover focus-visible:state-focus data-active-item:state-focus data-focus-visible:state-focus group col-span-full grid grid-cols-subgrid px-4",
			itemAvatar: "h-10 w-10 overflow-hidden rounded-full *:h-full *:w-full",
			itemImg: "h-14 w-14 overflow-hidden *:h-full *:w-full",
			itemIcon: "i",
			itemContent:
				"flex h-full flex-col first:col-span-2 last:col-span-2 first:last:col-span-3",
			itemTitle: "text-body-lg text-on-surface truncate",
			itemSubtitle: "text-body-md text-on-surface-variant",
			trailingSupportingText: "text-label-sm text-on-surface-variant text-end",
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
