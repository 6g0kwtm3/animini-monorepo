import plugin from "tailwindcss/plugin"
export const classGroups = {
	navigation: ["navigation-bar", "navigation-rail", "navigation-drawer"],
	"navigation-align": [
		"navigation-start",
		"navigation-center",
		"navigation-end",
	],
}

export const navigation = plugin((ctx) => {
	ctx.addComponents({
		".navigation": {
			"@apply fixed bottom-0 start-0 z-50": {},

			"& .navigation-label": { "@apply relative flex text-center": {} },

			"& .navigation-active-indicator": {
				"@apply bg-secondary-container absolute": {},
			},

			"& .navigation-icon": { "@apply i *:last:hidden": {} },

			"& .navigation-large-badge": {
				"@apply bg-error text-label-sm text-on-error flex h-4 min-w-4 items-center justify-center rounded-sm px-1":
					{},
			},
		},

		".navigation-bar": {
			"@apply bg-surface-container end-0 grid h-20 grid-flow-col gap-2 [grid-auto-columns:minmax(0,1fr)]":
				{},

			"& .navigation-label": {
				'@apply text-label-md text-on-surface-variant aria-[current="page"]:text-on-surface flex-1 flex-col items-center gap-1 pb-4 pt-3':
					{},
			},

			"& .navigation-active-indicator": {
				'@apply h-8 w-16 scale-x-0 rounded-lg transition-transform group-aria-[current="page"]:scale-x-100':
					{},
			},

			"& .navigation-icon": {
				'@apply group-hover:state-hover group-aria-[current="page"]:text-on-secondary-container group-focused:state-focus group-pressed:state-pressed relative flex h-8 w-16 items-center justify-center rounded-lg *:first:group-aria-[current="page"]:hidden *:last:group-aria-[current="page"]:block':
					{},
			},

			"& .navigation-large-badge": { "@apply absolute left-1/2": {} },
		},

		".navigation-rail": {
			"@apply bg-surface top-0 flex h-full w-20 shrink-0 flex-col gap-3": {},

			"& .navigation-label": {
				'@apply text-label-md text-on-surface-variant aria-[current="page"]:text-on-surface grow-0 flex-col items-center gap-1 px-2 py-0':
					{},
			},

			"& .navigation-active-indicator": {
				'@apply h-8 w-14 scale-x-0 rounded-lg transition-transform group-aria-[current="page"]:scale-x-100':
					{},
			},

			"& .navigation-icon": {
				'@apply group-hover:text-on-surface group-hover:state-hover group-aria-[current="page"]:text-on-secondary-container group-focused:text-on-surface group-focused:state-focus group-pressed:text-on-surface group-pressed:state-pressed relative flex h-8 w-14 items-center justify-center rounded-lg *:first:group-aria-[current="page"]:hidden *:last:group-aria-[current="page"]:block':
					{},
			},

			"& .navigation-large-badge": { "@apply absolute left-1/2": {} },
		},

		".navigation-drawer": {
			"@apply bg-surface top-0 flex h-full w-[22.5rem] shrink-0 flex-col justify-start gap-0 p-3":
				{},

			"& .navigation-label": {
				'@apply text-label-lg text-on-surface-variant hover:state-hover aria-[current="page"]:text-on-secondary-container focused:state-focus pressed:state-pressed min-h-14 grow-0 flex-row items-center gap-3 rounded-xl px-4 py-0':
					{},
			},

			"& .navigation-active-indicator": {
				'@apply inset-0 -z-10 hidden h-full w-full scale-x-100 rounded-xl group-aria-[current="page"]:block group-aria-[current="page"]:[view-transition-name:var(--id)]':
					{},
			},

			"& .navigation-icon": {
				'@apply group-hover:text-on-surface group-hover:state-none group-focused:text-on-surface group-focused:state-none group-pressed:text-on-surface group-pressed:state-none h-6 w-6 *:first:group-aria-[current="page"]:block *:last:group-aria-[current="page"]:hidden':
					{},
			},

			"& .navigation-large-badge": { "@apply static ms-auto": {} },
		},

		".navigation-start": { "@apply justify-start": {} },
		".navigation-center": { "@apply justify-center": {} },
		".navigation-end": { "@apply justify-end": {} },
	})
})
