import type { Meta, StoryObj } from "@storybook/react"
import {
	NavigationItem,
	NavigationItemIcon,
	NavigationItemLargeBadge,
} from "~/components/Navigation"

import { fn } from "@storybook/test"
import MaterialSymbolsNotifications from "~icons/material-symbols/notifications"
import MaterialSymbolsNotificationsOutline from "~icons/material-symbols/notifications-outline"

import MaterialSymbolsImagesmode from "~icons/material-symbols/imagesmode"
import MaterialSymbolsImagesmodeOutline from "~icons/material-symbols/imagesmode-outline"
// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
	title: "Example/NavigationItem",
	component: NavigationItem,
	subcomponents: {
		//@ts-expect-error
		NavigationItemIcon,
		//@ts-expect-error
		NavigationItemLargeBadge,
	},
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: "centered",
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ["autodocs"],
	// More on argTypes: https://storybook.js.org/docs/api/argtypes
	argTypes: {},
	// Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
	args: { onClick: fn() },
} satisfies Meta<typeof NavigationItem>

export default meta
type Story = StoryObj<typeof meta>

export const LongLabel: Story = {
	args: {
		children: (
			<>
				<NavigationItemIcon>
					<MaterialSymbolsImagesmodeOutline />
					<MaterialSymbolsImagesmode />
				</NavigationItemIcon>
				<div className="max-w-full break-words">All Images</div>
			</>
		),
	},
}

export const Default: Story = {
	args: {
		children: (
			<>
				<NavigationItemIcon>
					<MaterialSymbolsNotificationsOutline />
					<MaterialSymbolsNotifications />
				</NavigationItemIcon>
				<div className="max-w-full break-words">Notifications</div>
				<NavigationItemLargeBadge>13+</NavigationItemLargeBadge>
			</>
		),
	},
}

export const Active: Story = {
	args: {
		...Default.args,
		active: true,
	},
}

export const ActiveContrast: Story = {
	...Active,
	parameters: {
		contrastMore: true,
	},
}
