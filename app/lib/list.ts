import { createTV } from "tailwind-variants"

const tv = createTV({ twMerge: false })

export const list = tv({
	slots: {
		root: "grid grid-flow-row grid-cols-[auto_1fr_auto] gap-x-4 py-2",
		item: "group col-span-full grid grid-cols-subgrid px-4 outline-none state-on-surface hover:state-hover focus-visible:state-focus data-[active-item]:state-focus data-[focus-visible]:state-focus"
	},
	variants: {
		lines: {
			two: { item: "items-center py-2" },
			three: { item: "items-start py-3" }
		}
	},
	defaultVariants: {
		lines: "two"
	}
})
