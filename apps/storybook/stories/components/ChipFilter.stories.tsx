import type { Meta, StoryObj } from "@storybook/react-vite"
import {
	ChipFilter,
	ChipFilterCheckbox,
	ChipFilterRadio,
} from "@animedes/components/Chip"

const meta = {
	title: "Components/ChipFilter",
	component: ChipFilter,
	args: { children: "Completed" },
	decorators: [
		(Story) => (
			<div className="flex flex-wrap items-center gap-2 p-4">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof ChipFilter>

export default meta

type Story = StoryObj<typeof meta>

export const Unchecked: Story = {
	render: (args) => (
		<ChipFilter {...args}>
			<ChipFilterCheckbox />
			{args.children}
		</ChipFilter>
	),
}

export const Checked: Story = {
	render: (args) => (
		<ChipFilter {...args}>
			<ChipFilterCheckbox defaultChecked />
			{args.children}
		</ChipFilter>
	),
}

export const Radio = {
	render: () => (
		<>
			{["Planned", "Current", "Completed"].map((label) => (
				<ChipFilter key={label} data-key={label}>
					<ChipFilterRadio name="status" />
					{label}
				</ChipFilter>
			))}
		</>
	),
	args: {},
} satisfies Story
