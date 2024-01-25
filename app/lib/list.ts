import { tv } from "tailwind-variants"

export const list = tv({
	slots: {
		root: "grid grid-flow-row grid-cols-[auto_1fr_auto] gap-x-4 py-2",
		item: "group col-span-full grid grid-cols-subgrid items-start px-4 py-3 state-on-surface hover:state-hover focus-visible:state-focus outline-none data-[focus-visible]:state-focus "
	}
})