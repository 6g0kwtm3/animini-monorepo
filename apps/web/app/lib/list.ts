import plugin from "tailwindcss/plugin"

export const classGroups = { list: ["list-one", "list-two", "list-three"] }

export const list = plugin((ctx) => {
	ctx.addComponents({
		".list": {
			"& .list-item-avatar": {
				"@apply h-10 w-10 overflow-hidden rounded-full *:h-full *:w-full": {},
			},

			"& .list-item-img": {
				"@apply h-14 w-14 overflow-hidden *:h-full *:w-full": {},
			},

			"& .list-item-icon": { "@apply i": {} },

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

		".list-one": { "& .list-item-subtitle": { "@apply hidden": {} } },

		".list-two": { "& .list-item-subtitle": { "@apply block truncate": {} } },

		".list-three": { "& .list-item-subtitle": { "@apply line-clamp-2": {} } },
	})
})
