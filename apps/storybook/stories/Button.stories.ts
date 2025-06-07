import { fn } from "storybook/test"

import type { Meta, StoryObj } from "@storybook/react-vite"
import { Button } from "m3-react/Button"

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
	title: "Example/Button",
	component: Button,
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: "centered",
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ["autodocs"],
	// More on argTypes: https://storybook.js.org/docs/api/argtypes
	argTypes: { backgroundColor: { control: "color" } },
	// Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
	args: { onClick: fn() },
} satisfies Meta<typeof Button>

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
type Story = StoryObj<typeof Button>
// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Filled = { args: { children: "Button" } } satisfies Story

export const Elevated = {
	args: { children: "Button",  color: "elevated" },
} satisfies Story
export const Outlined = {
	args: { children: "Button",  color: "outlined" },
} satisfies Story
export const Text = {
	args: { children: "Button",  color: "text" },
} satisfies Story
export const Tonal = {
	args: { ...Outlined.args,  color: "tonal" },
} satisfies Story

export const ExtraSmall = {
	args: { ...Outlined.args,  size: "xs" },
} satisfies Story

export const Small = {
	args: { ...Outlined.args,  size: "sm" },
} satisfies Story

export const Medium = { args: { ...Outlined.args,  size: "md" } }

export const Large = {
	args: { ...Outlined.args,  size: "lg" },
} satisfies Story

export const ExtraLarge = { args: { ...Outlined.args,  size: "xl" } }

export const FilledDisabled = { args: { ...Filled.args, disabled: true } }
export const ElevatedDisabled = { args: { ...Elevated.args, disabled: true } }
export const OutlinedDisabled = { args: { ...Outlined.args, disabled: true } }
export const TextDisabled = { args: { ...Text.args, disabled: true } }
export const TonalDisabled = { args: { ...Tonal.args, disabled: true } }
