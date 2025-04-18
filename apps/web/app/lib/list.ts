import plugin from "tailwindcss/plugin"

export const classGroups = { list: ["list-one", "list-two", "list-three"] }

export const list = plugin((ctx) => {
	ctx.addComponents({
		".list": {
			"@apply grid grid-cols-[auto_minmax(0,1fr)_auto] gap-x-4": {},

			"& .list-item": {
				"@apply hover:state-hover focus-visible:state-focus data-active-item:state-focus data-focus-visible:state-focus col-span-full grid grid-cols-subgrid px-4":
					{},
			},

			"& .list-item-avatar": {
				"@apply h-10 w-10 overflow-hidden rounded-full *:h-full *:w-full": {},
			},

			"& .list-item-img": {
				"@apply h-14 w-14 overflow-hidden *:h-full *:w-full": {},
			},

			"& .list-item-icon": { "@apply i": {} },

			"& .list-item-content": {
				"@apply flex h-full flex-col first:col-span-2 last:col-span-2 first:last:col-span-3":
					{},
			},

			"& .list-item-title": {
				"@apply text-body-lg text-on-surface truncate": {},
			},

			"& .list-item-subtitle": {
				"@apply text-body-md text-on-surface-variant": {},
			},

			"& .list-item-trailing-supporting-text": {
				"@apply text-label-sm text-on-surface-variant text-end": {},
			},
		},

		".list-one": {
			"& .list-item": { "@apply min-h-[3.5rem] items-center": {} },

			"& .list-item-subtitle": { "@apply hidden": {} },

			"& .list-item-content": { "@apply justify-center py-2": {} },
		},

		".list-two": {
			"& .list-item": { "@apply min-h-[4.5rem] items-center": {} },

			"& .list-item-subtitle": { "@apply block truncate": {} },

			"& .list-item-content": { "@apply justify-center py-2": {} },
		},

		".list-three": {
			"& .list-item": { "@apply min-h-[5.5rem] items-start": {} },

			"& .list-item-subtitle": { "@apply line-clamp-2": {} },

			"& .list-item-content": { "@apply justify-start py-3": {} },
		},
	})
})
