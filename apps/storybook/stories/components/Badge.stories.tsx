import type { Meta, StoryObj } from "@storybook/react-vite"
import { Badge } from "@animedes/components/Badge"

const meta = {
	title: "Components/Badge",
	component: Badge,
	args: { children: "3" },
	decorators: [
		(Story) => (
			<div className="relative inline-grid size-12 place-items-center p-4">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof Badge>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Long = { args: { children: "99+" } } satisfies Story
