import type { Meta, StoryObj } from "@storybook/react"
import { Navigation, NavigationItem } from "~/components/Navigation"

import * as NavigationItemStories from "./NavigationItem.stories"

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
	title: "Example/Navigation",
	component: Navigation,
	subcomponents: {
		//@ts-expect-error react 19 not compatible with storybook
		NavigationItem,
	},
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: "fullscreen",
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ["autodocs"],
	// More on argTypes: https://storybook.js.org/docs/api/argtypes
	argTypes: {},
	// Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
} satisfies Meta<typeof Navigation>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
	render: (args) => (
		<Navigation {...args}>
			<NavigationItem {...NavigationItemStories.LongLabel.args} />
			<NavigationItem {...NavigationItemStories.Active.args} />
		</Navigation>
	),
}

export const Contrast: Story = {
	...Default,
	parameters: {
		contrastMore: true,
	},
}

export const Rail: Story = {
	...Default,
	args: {
		variant: "rail",
		align: "center",
	},
}

export const RailContrast: Story = {
	...Rail,
	parameters: {
		contrastMore: true,
	},
}

export const RailRtl: Story = {
	...Rail,
	parameters: {
		dir: "rtl",
	},
}

export const Drawer: Story = {
	...Default,
	args: {
		variant: "drawer",
	},
}

export const DrawerContrast: Story = {
	...Drawer,
	parameters: {
		contrastMore: true,
	},
}

export const DrawerRtl: Story = {
	...Drawer,
	parameters: {
		dir: "rtl",
	},
}
