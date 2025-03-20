import type { Meta, StoryObj } from "@storybook/react"
import { userEvent } from "@storybook/test"
import {
	Icon,
	TooltipPlain,
	TooltipPlainContainer,
	TooltipPlainTrigger,
} from "~/components"

import * as IconStories from "./ButtonIcon.stories"

const meta = {
	title: "Example/TooltipPlain",
	component: TooltipPlain,
	parameters: {
		layout: "centered",
		docs: {
			story: {
				inline: false,
			},
		},
	},
	tags: ["autodocs"],
} satisfies Meta<typeof TooltipPlain>

export default meta

type Story = StoryObj<typeof meta>

export const Default = {
	args: {
		children: <TooltipPlainContainer>Plain Tooltip</TooltipPlainContainer>,
		open: true,
	},
} satisfies Story

export const Focus = {
	args: {
		children: (
			<>
				<TooltipPlainTrigger
					render={<Icon {...IconStories.Default.args} label="" />}
				/>
				<TooltipPlainContainer>Present now</TooltipPlainContainer>
			</>
		),
	},
	async play() {
		await userEvent.keyboard("{Tab}")
	},
} satisfies Story
