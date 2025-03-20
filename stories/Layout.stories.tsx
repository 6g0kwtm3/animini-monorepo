import type { Meta, StoryObj } from "@storybook/react"
import { Layout, LayoutBody, LayoutHandle, LayoutPane } from "~/components"

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
	title: "Example/Layout",
	component: Layout,
	subcomponents: {
		LayoutPane,
		LayoutHandle,
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
} satisfies Meta<typeof Layout>

export default meta

type Story = StoryObj<typeof meta>
export const Default = {
	args: {
		children: (
			<>
				<LayoutBody>
					<LayoutPane className="relative" variant="fixed">
						<LayoutHandle></LayoutHandle>
						Foo
					</LayoutPane>
					<LayoutPane>Bar</LayoutPane>
				</LayoutBody>
			</>
		),
	},
} satisfies Story
