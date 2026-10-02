import type { Meta, StoryObj } from "@storybook/react-vite"
import { Loading, Skeleton } from "@animedes/components"

const meta = {
	title: "Components/Skeleton",
	component: Skeleton,
	decorators: [
		(Story) => (
			<div className="grid max-w-sm gap-2 p-4">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof Skeleton>

export default meta

type Story = StoryObj<typeof meta>

export const Text = {
	render: () => (
		<Loading>
			<Skeleton aria-label="Loading text" />
		</Loading>
	),
	args: {},
} satisfies Story

export const TextBlock = {
	render: () => (
		<Loading>
			<>
				<Skeleton aria-label="Loading line" />
				<Skeleton aria-label="Loading line" />
				<Skeleton aria-label="Loading line" />
			</>
		</Loading>
	),
	args: {},
} satisfies Story

export const Full = {
	render: () => (
		<Loading>
			<Skeleton full aria-label="Loading block" />
		</Loading>
	),
	args: {},
} satisfies Story

export const WithoutLoadingContext = {
	render: () => <Skeleton>Rendered content</Skeleton>,
	args: {},
} satisfies Story