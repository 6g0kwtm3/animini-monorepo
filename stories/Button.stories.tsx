import type { Meta, StoryObj } from "@storybook/react"
import { fn } from "@storybook/test"
import { Button, ButtonIcon } from "~/components/Button"

import MaterialSymbolsAdd from "~icons/material-symbols/add"

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
	title: "Example/Button",
	component: Button,
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
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Text: Story = {
	args: {
		children: "Button",
	},
}

export const Elevated: Story = {
	args: {
		variant: "elevated",
		children: "Button",
	},
}

export const Filled: Story = {
	args: {
		variant: "filled",
		children: "Button",
	},
}

export const Outlined: Story = {
	args: {
		variant: "outlined",
		children: "Button",
	},
}

export const Tonal: Story = {
	args: {
		variant: "tonal",
		children: "Button",
	},
}

export const TextIcon: Story = {
	args: {
		...Text.args,
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

export const ElevatedIcon: Story = {
	args: {
		...TextIcon.args,
		variant: "elevated",
	},
}

export const FilledIcon: Story = {
	args: {
		...TextIcon.args,
		variant: "filled",
	},
}

export const OutlinedIcon: Story = {
	args: {
		...TextIcon.args,
		variant: "outlined",
	},
}

export const TonalIcon: Story = {
	args: {
		...TextIcon.args,
		variant: "tonal",
	},
}

export const TextIconRtl: Story = {
	...TextIcon,
	parameters: {
		dir: "rtl",
	},
}

export const ElevatedIconRtl: Story = {
	...ElevatedIcon,
	parameters: {
		...TextIconRtl.parameters,
	},
}

export const FilledIconRtl: Story = {
	...FilledIcon,
	parameters: {
		...TextIconRtl.parameters,
	},
}

export const OutlinedIconRtl: Story = {
	...OutlinedIcon,
	parameters: {
		...TextIconRtl.parameters,
	},
}

export const TonalIconRtl: Story = {
	...TonalIcon,
	parameters: {
		...TextIconRtl.parameters,
	},
}
