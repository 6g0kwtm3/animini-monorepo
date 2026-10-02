import type { Meta, StoryObj } from "@storybook/react-vite"
import { AppBar, AppBarTitle } from "@animedes/components"

const meta = {
	title: "Components/AppBar",
	component: AppBar,
	argTypes: {
		variant: { control: "select", options: ["small", "medium", "large"] },
		elevate: { control: "boolean" },
		hide: { control: "boolean" },
	},
	args: { variant: "small", elevate: false, hide: false },
	decorators: [
		(Story) => (
			<div className="border-outline-variant border">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof AppBar>

export default meta

type Story = StoryObj<typeof meta>

function Title({ children }: { children: string }) {
	return <AppBarTitle>{children}</AppBarTitle>
}

export const Small: Story = {
	render: (args) => (
		<AppBar {...args}>
			<Title>Small</Title>
		</AppBar>
	),
}

export const Medium: Story = {
	render: (args) => (
		<AppBar {...args}>
			<Title>Medium</Title>
		</AppBar>
	),
	args: { variant: "medium" },
}

export const Large: Story = {
	render: (args) => (
		<AppBar {...args}>
			<Title>Large</Title>
		</AppBar>
	),
	args: { variant: "large" },
}

export const Elevated: Story = {
	render: (args) => (
		<AppBar {...args}>
			<Title>Elevated</Title>
		</AppBar>
	),
	args: { elevate: true },
}