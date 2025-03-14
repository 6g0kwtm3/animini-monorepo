import { createContext } from "react"
import { tv } from "~/lib/tailwind-variants"

export const createSearchView = tv(
	{
		slots: {
			root: "bg-surface-container-high fixed mt-0 flex overflow-hidden",
			input:
				"text-body-lg text-on-surface placeholder:text-body-lg placeholder:text-on-surface-variant w-full bg-transparent p-4 [&::-webkit-search-cancel-button]:me-0 [&::-webkit-search-cancel-button]:ms-4",
			backdrop:
				"bg-scrim/40 data-enter:opacity-100 opacity-0 transition-[opacity]",
			body: "text-body-md text-on-surface overflow-auto overscroll-contain",
		},
		variants: {
			variant: {
				fullscreen: {
					input: "h-[4.5rem]",
					root: `inset-0`,
				},
				docked: {
					input: "h-14",
					root: "inset-[3.5rem] mx-auto mt-0 h-fit max-h-[66dvh] w-fit min-w-[22.5rem] max-w-[45rem] rounded-xl py-0",
				},
			},
		},
		defaultVariants: { variant: "docked" },
	},
	{ responsiveVariants: ["sm"] }
)

export const SearchViewContext = createContext(createSearchView())
