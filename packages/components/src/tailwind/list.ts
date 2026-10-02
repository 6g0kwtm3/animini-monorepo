import plugin from "tailwindcss/plugin"

export const classGroups = { list: ["list-one", "list-two", "list-three"] }

export const list = plugin((ctx) => {
	ctx.addComponents({
		".list-item-avatar": {
			"@apply h-10 w-10 overflow-hidden rounded-full *:h-full *:w-full": {},
		},

		".list-item-icon": { "@apply i": {} },

		".list-item-title": { "@apply text-body-lg text-on-surface truncate": {} },

		".list-item-trailing-supporting-text": {
			"@apply text-label-sm text-on-surface-variant text-end": {},
		},
	})
})
