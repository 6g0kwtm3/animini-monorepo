import { tv } from "./tailwind-variants"

export const createMenu = tv({
	slots: {
		root: "bg-surface-container text-label-lg text-on-surface flex flex-col overflow-auto overscroll-contain rounded-xs py-2",
		item: "group bg-surface-container text-label-lg text-on-surface hover:state-hover focus:state-focus flex h-12 items-center gap-3 px-3",
	},
	variants: {
		size: {
			full: { root: "max-w-[17.5rem] min-w-[7rem]" },
		},
	},
})
