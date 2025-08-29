import plugin from "tailwindcss/plugin"

export const classGroups = {
	"search-view": ["search-view-docked", "search-view-fullscreen"],
}

export const searchView = plugin((ctx) => {
	ctx.addComponents({
		".search-view": {
			"& .search-view-backdrop": {
				"@apply bg-scrim/40 data-enter:opacity-100 opacity-0 transition-[opacity] ease-effects-fast duration-effects-fast":
					{},
			},

			"& .search-view-body": {
				"@apply text-body-md text-on-surface overflow-auto overscroll-contain":
					{},
			},
			"& .search-view-input": {
				"@apply text-body-lg text-on-surface placeholder:text-body-lg placeholder:text-on-surface-variant w-full bg-transparent p-4 [&::-webkit-search-cancel-button]:me-0 [&::-webkit-search-cancel-button]:ms-4":
					{},
			},

			"@apply bg-surface-container-high fixed mt-0 flex overflow-hidden": {},
		},

		".search-view-docked": {
			"& .search-view-input": { "@apply h-14": {} },

			"@apply inset-[3.5rem] mx-auto mt-0 h-fit max-h-[66dvh] w-fit min-w-[22.5rem] max-w-[45rem] rounded-xl py-0":
				{},
		},

		".search-view-fullscreen": {
			"& .search-view-input": { "@apply h-[4.5rem]": {} },
			"@apply inset-0": {},
		},
	})
})
