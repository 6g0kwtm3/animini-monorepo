import type { Meta, StoryObj } from "@storybook/react-vite"
import { Loading, Skeleton } from "@animedes/components/Skeleton"
import { Rating } from "@animedes/components/Rating"

function Star() {
	return (
		<svg
			viewBox="0 0 24 24"
			aria-hidden
			focusable={false}
			className="i h-6 w-6"
		>
			<path
				d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
				fill="currentColor"
			/>
		</svg>
	)
}

const meta = {
	title: "Components/Rating",
	component: Rating,
	args: { defaultValue: 3, name: "rating" },
	decorators: [
		(Story) => (
			<div className="text-on-surface p-4">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof Rating>

export default meta

type Story = StoryObj<typeof meta>

function stars() {
	return [Star, Star, Star, Star, Star]
}

export const Default: Story = {
	render: (args) => <Rating {...args}>{stars()}</Rating>,
	args: { defaultValue: 3 },
}

export const OneStar: Story = {
	render: (args) => <Rating {...args}>{stars()}</Rating>,
	args: { defaultValue: 1 },
}

export const FiveStars: Story = {
	render: (args) => <Rating {...args}>{stars()}</Rating>,
	args: { defaultValue: 5 },
}

export const LoadingRating = {
	render: () => (
		<Loading>
			<Skeleton aria-label="Loading rating" />
		</Loading>
	),
	args: {},
} satisfies Story
