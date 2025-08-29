import { tv } from "~/lib/tailwind-variants"

export const createDialog = tv(
	{
		defaultVariants: { variant: "basic" },
		slots: {
			actions: "flex justify-end gap-2 px-6",
			backdrop: "",
			body: "text-body-md text-on-surface overflow-auto overscroll-contain px-6",
			content: "flex w-full flex-col",
			headline: "text-on-surface",
			root: "bg-surface-container-high fixed flex overflow-hidden",
		},
		variants: {
			variant: {
				basic: {
					actions: "h-auto",
					backdrop:
						"bg-scrim/40 data-enter:opacity-100 opacity-0 transition-[opacity] ease-effects-slow duration-effects-slow",
					body: "pt-0",
					content: "gap-6",
					headline:
						"text-headline-sm -mb-2 h-auto px-6 text-center first:text-start",
					root: "inset-[3.5rem] m-auto h-fit max-h-[calc(100%-7rem)] w-fit min-w-[17.5rem] max-w-[35rem] rounded-xl py-6",
				},
				fullscreen: {
					actions: "h-14",
					body: "pt-6",
					content: "",
					headline:
						"text-title-lg flex h-14 shrink-0 items-center gap-4 truncate px-4",
					root: "inset-0",
				},
			},
		},
	},
	{ responsiveVariants: ["sm"] }
)
