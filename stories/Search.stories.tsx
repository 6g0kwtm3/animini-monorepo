import type { Meta, StoryObj } from "@storybook/react"
import { expect, userEvent, waitFor, within } from "@storybook/test"
import { SearchView } from "~/components"

import { Search } from "~/lib/search/Search"
import { mockList, mockMedia } from "~/mocks/entities"
import { operation, query } from "~/mocks/handlers"

import * as searchRoute from "~/routes/_nav.search/route"

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
	title: "Example/Site/Search",
	component: Search,
	// @ts-expect-error
	subcomponents: { SearchView },
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: "centered",
		docs: {
			story: {
				inline: false,
			},
		},
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ["autodocs"],
	// More on argTypes: https://storybook.js.org/docs/api/argtypes
	argTypes: {},
} satisfies Meta<typeof Search>

export default meta
type Story = StoryObj<typeof meta>

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
const results = mockList(
	0,
	mockMedia({
		title: {
			userPreferred: "Foo",
		},
	}),
	mockMedia({
		title: {
			userPreferred: "Bar",
		},
	}),
	mockMedia({
		title: {
			userPreferred: "Baz",
		},
	})
)

export const Text: Story = {
	args: {},
	parameters: {
		msw: {
			handlers: [
				query(
					"routeNavSearchQuery",
					operation(() => ({
						Page: {
							media(args: { search?: string }) {
								const search = args.search?.toLocaleLowerCase().split(" ")

								return results.filter((el) =>
									search?.some((word) =>
										el.title.userPreferred.toLocaleLowerCase().includes(word)
									)
								)
							},
						},
					}))
				),
			],
		},
		router: {
			routes: (Story: any) => [
				{
					path: "search",
					Component: searchRoute.default,
					loader: searchRoute.clientLoader,
				},
				{
					path: "/",
					Component: Story,
				},
			],
		},
	},
	async play({ canvasElement }) {
		const body = within(canvasElement.parentElement!)

		//when
		await userEvent.keyboard("{Control>}k{/Control}")
		//then
		await body.findByRole("combobox")
	},
}

export const Open: Story = {
	...Text,
	parameters: {
		router: {
			//when
			initialEntries: ["/?sheet=search"],
		},
	},
	async play({ canvasElement }) {
		const body = within(canvasElement.parentElement!)
		//then
		await body.findByRole("combobox")
	},
}

export const Close: Story = {
	...Open,
	async play({ canvasElement }) {
		const body = within(canvasElement.parentElement!)
		const search = await body.findByRole("combobox")
		//when
		await userEvent.keyboard("{Escape}{Escape}")
		//then
		await waitFor(async () => expect(search).not.toBeVisible())
	},
}
