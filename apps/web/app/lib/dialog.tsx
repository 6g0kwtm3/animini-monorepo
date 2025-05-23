import { tv } from "~/lib/tailwind-variants"

export const createDialog = tv(
	{
		slots: {
			root: "bg-surface-container-high fixed flex overflow-hidden",
			content: "flex w-full flex-col",
			backdrop: "",
			headline: "text-on-surface",
			body: "text-body-md text-on-surface overflow-auto overscroll-contain px-6",
			actions: "flex justify-end gap-2 px-6",
		},
		variants: {
			variant: {
				basic: {
					root: "inset-[3.5rem] m-auto h-fit max-h-[calc(100%-7rem)] w-fit min-w-[17.5rem] max-w-[35rem] rounded-xl py-6",
					content: "gap-6",
					backdrop:
						"bg-scrim/40 data-enter:opacity-100 opacity-0 transition-[opacity]",
					headline:
						"text-headline-sm -mb-2 h-auto px-6 text-center first:text-start",
					body: "pt-0",
					actions: "h-auto",
				},
				fullscreen: {
					root: "inset-0",
					content: "",
					headline:
						"text-title-lg flex h-14 shrink-0 items-center gap-4 truncate px-4",
					body: "pt-6",
					actions: "h-14",
				},
			},
		},
		defaultVariants: { variant: "basic" },
	},
	{ responsiveVariants: ["sm"] }
)
