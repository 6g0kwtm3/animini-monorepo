import { tv } from "tailwind-variants"

export const dialog = tv(
	{
		slots: {
			root: "flex bg-surface-container-high surface elevation-3",
			content: "flex w-full flex-col overflow-hidden",
			backdrop: "",
			headline: "text-on-surface",
			body: "overflow-auto overscroll-contain px-6 text-body-md text-on-surface",
			actions: "flex justify-end gap-2 px-6",
		},
		variants: {
			variant: {
				basic: {
					root: "inset-[3.5rem] m-auto h-fit max-h-[calc(100%-7rem)] w-fit min-w-[17.5rem] max-w-[35rem] rounded-xl py-6",
					content: "gap-6",
					backdrop: "bg-scrim/40",
					headline:
						"-mb-2 h-auto px-6 text-center text-headline-sm first:text-start",
					body: "pt-0",
					actions: "h-auto",
				},
				fullscreen: {
					root: "fixed inset-0",
					content: "",
					headline:
						"flex h-14 shrink-0 items-center gap-4 truncate px-4 text-title-lg",
					body: "pt-6",
					actions: "h-14",
				},
			},
		},
		defaultVariants: { variant: "basic" },
	},
	{ responsiveVariants: ["sm"] },
)
