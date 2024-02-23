import { createTV } from "tailwind-variants"

const tv = createTV({ twMerge: false })

export const createList = tv(
	{
		slots: {
			root: "grid grid-cols-[auto_1fr_auto] gap-x-4 py-2 [grid-auto-rows:1fr]",
			subheader: "",
			item: "group col-span-full grid grid-cols-subgrid px-4 outline-none hover:state-hover focus-visible:state-focus data-[active-item]:state-focus data-[focus-visible]:state-focus",
			itemTitle: "truncate text-body-lg text-on-surface",
			itemSubtitle: "text-body-md text-on-surface-variant",
			trailingSupportingText: "text-end text-label-sm text-on-surface-variant"
		},
		variants: {
			lines: {
				one: {
					root: "",
					item: "min-h-[3.5rem] items-center py-2",
					itemSubtitle: "hidden"
				},
				two: {
					root: "",
					item: "min-h-[4.5rem] items-center py-2",
					itemSubtitle: "block truncate"
				},
				three: {
					root: "",
					item: "min-h-[5.5rem] items-start py-3",
					itemSubtitle: "line-clamp-2"
				}
			}
		},
		defaultVariants: {
			lines: "two"
		}
	},
	{
		responsiveVariants: ["sm"]
	}
)
