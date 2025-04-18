import plugin from "tailwindcss/plugin"

export const classGroups = {
	layout: [
		"layout-navigation-none",
		"layout-navigation-bar",
		"layout-navigation-rail",
		"layout-navigation-drawer",
	],
}

export const layout = plugin(({ addComponents }) => {
	addComponents({
		".layout": {
			"@apply isolate": {},

			"& .layout-body": {
				"@apply flex gap-6 pe-4 sm:pe-6": {},
			},
		},

		".layout-navigation-none": {
			"& .layout-body": {
				"@apply pb-0 ps-4 sm:ps-6": {},
			},
		},
		".layout-navigation-bar": {
			"& .layout-body": { "@apply pb-20 ps-4 sm:ps-6": {} },
		},
		".layout-navigation-rail": {
			"& .layout-body": { "@apply pb-0 ps-20 sm:ps-20": {} },
		},
		".layout-navigation-drawer": {
			"& .layout-body": { "@apply pb-0 ps-[22.5rem] sm:ps-[22.5rem]": {} },
		},
	})
})
