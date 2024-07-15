import type { Meta, StoryObj } from "@storybook/react"
import { fn } from "@storybook/test"
import { Button, ButtonIcon } from "~/components/Button"

import MaterialSymbolsAdd from "~icons/material-symbols/add"

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
	title: "Example/Button",
	component: Button,
	// @ts-expect-error
	subcomponents: { ButtonIcon },
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: "centered",
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ["autodocs"],
	// More on argTypes: https://storybook.js.org/docs/api/argtypes
	argTypes: {
		"aria-disabled": {
			control: "boolean",
		},
		variant: {
			control: "select",
			options: ["elevated", "filled", "outlined", "tonal", "text"],
		},
	},
	// Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
	args: { onClick: fn() },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Text: Story = {
	args: {
		children: "Button",
	},
}

export const Variants: Story = {
	args: {
		children: "Button",
	},
	render: (args) => (
		<>
			<Button {...args} />
			<Button {...args} variant="elevated" />
			<Button {...args} variant="filled" />
			<Button {...args} variant="outlined" />
			<Button {...args} variant="tonal" />
		</>
	),
	decorators: [
		(Story) => (
			<div className="flex flex-wrap gap-2 rtl:flex-row-reverse">
				<Story />
			</div>
		),
	],
}

export const VariantsIcon: Story = {
	...Variants,
	args: {
		children: (
			<>
				<ButtonIcon>
					<MaterialSymbolsAdd />
				</ButtonIcon>
				Button
			</>
		),
	},
}

export const VariantsIconDisabled: Story = {
	...VariantsIcon,
	args: {
		...VariantsIcon.args,
		"aria-disabled": true,
	},
}

export const VariantsIconRtl: Story = {
	...VariantsIcon,
	parameters: {
		dir: "rtl",
	},
}
