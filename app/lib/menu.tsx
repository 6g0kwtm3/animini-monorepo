import { tv } from "tailwind-variants";

export const menu = tv({
  slots: {
    root: "rounded-xs flex flex-col overflow-auto overscroll-contain bg-surface-container py-2 text-label-lg text-on-surface surface elevation-2",
    item: "group flex h-12 items-center gap-3 bg-surface-container px-3 text-label-lg text-on-surface surface elevation-2 state-on-surface hover:state-hover focus:state-focus",
  },
  variants: {
    size: {
      full: { root: "min-w-[7rem] max-w-[17.5rem]" },
    },
  },
})