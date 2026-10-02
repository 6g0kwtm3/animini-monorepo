import type { Meta, StoryObj } from "@storybook/react-vite"
import { Card } from "@animedes/components/Card"

const meta = {
	title: "Components/Card",
	component: Card,
	argTypes: {
		variant: { control: "select", options: ["outlined", "filled", "elevated"] },
		interactive: { control: "boolean" },
	},
	args: { variant: "outlined", interactive: false },
	decorators: [
		(Story) => (
			<div className="p-4">
				<div className="max-w-sm">
					<Story />
				</div>
			</div>
		),
	],
} satisfies Meta<typeof Card>

export default meta

type Story = StoryObj<typeof meta>

const body = "Cards group related content and actions. The variant sets the container style."

export const Outlined: Story = { args: { variant: "outlined" } }
export const Filled: Story = { args: { variant: "filled" } }
export const Elevated: Story = { args: { variant: "elevated" } }

export const Interactive: Story = { args: { variant: "outlined", interactive: true } }

export const AllVariants = {
	render: (args) => (
		<div className="grid max-w-lg grid-cols-3 gap-4">
			{["outlined", "filled", "elevated"].map((variant) => (
				<Card {...args} key={variant} data-key={variant} variant={variant}>
					{body}
				</Card>
			))}
		</div>
	),
	args: {},
} satisfies Story