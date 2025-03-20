import { tv } from "~/lib/tailwind-variants"
export const createMenu = tv({
	slots: {
		root: "bg-surface-container text-label-lg text-on-surface rounded-xs flex flex-col overflow-auto overscroll-contain py-2",
		item: "bg-surface-container text-label-lg text-on-surface hover:state-hover focus:state-focus group flex h-12 items-center gap-3 px-3",
	},
	variants: {
		size: {
			full: { root: "min-w-[7rem] max-w-[17.5rem]" },
		},
	},
})
