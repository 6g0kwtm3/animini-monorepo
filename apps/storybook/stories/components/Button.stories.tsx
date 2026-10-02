import type { Meta, StoryObj } from "@storybook/react-vite"
import {
	Button,
	ButtonIcon as Icon,
} from "@animedes/components/Button"

const meta = {
	title: "Components/Button",
	component: Button,
	argTypes: {
		variant: {
			control: "select",
			options: [undefined, "outlined", "elevated", "filled", "text", "tonal"],
		},
	},
	args: { variant: "filled", children: "Button" },
	decorators: [
		(Story) => (
			<div className="p-4">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Outlined: Story = { args: { variant: "outlined" } }
export const Elevated: Story = { args: { variant: "elevated" } }
export const Filled: Story = { args: { variant: "filled" } }
export const Text: Story = { args: { variant: "text" } }
export const Tonal: Story = { args: { variant: "tonal" } }

export const Disabled: Story = { args: { disabled: true } }

export const AllVariants = {
	render: (args) => (
		<div className="flex flex-wrap items-center gap-4">
			{["filled", "outlined", "elevated", "tonal", "text"].map((variant) => (
				<Button {...args} key={variant} data-key={variant} variant={variant}>
					{variant}
				</Button>
			))}
		</div>
	),
	args: {},
} satisfies Story

export const WithIcon = {
	render: (args) => (
		<Button {...args}>
			<Icon>
				<svg viewBox="0 0 24 24" aria-hidden focusable={false}>
					<path d="M12 4v16m8-8H4" fill="none" stroke="currentColor" strokeWidth="2" />
				</svg>
			</Icon>
			Add
		</Button>
	),
	args: {},
} satisfies Story