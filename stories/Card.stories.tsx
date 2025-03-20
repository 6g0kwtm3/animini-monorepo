import type { Meta, StoryObj } from "@storybook/react"

import { Card, CardBody } from "~/components/Card"
import { Ariakit } from "~/lib/ariakit"
import { M3 } from "~/lib/components"

import { fn } from "@storybook/test"
import favicon from "~/../public/favicon.ico?url"
import MaterialSymbolsOpenInNew from "~icons/material-symbols/open-in-new"

const meta = {
	title: "Example/Card",
	component: Card,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {},
} satisfies Meta<typeof Card>

export default meta

type Story = StoryObj<typeof Card>

export const Default = {
	args: {
		children: (
			<CardBody>
				Make beautiful websites regardless of your design experience.
			</CardBody>
		),
	},
} satisfies Story

export const Elevated: Story = {
	args: { ...Default.args, variant: "elevated" },
}

export const Filled: Story = {
	args: { ...Default.args, variant: "filled" },
}

const click = fn()
export const WithDivider: Story = {
	args: {
		children: (
			<>
				<M3.CardHeader>
					<M3.List lines={"two"} className="p-0">
						<M3.ListItem className="hover:state-none p-0">
							<M3.ListItemImg>
								<img src={favicon} alt="" className="" />
							</M3.ListItemImg>
							<M3.ListItemContent className="">
								<M3.ListItemContentTitle>
									<Ariakit.Heading>Remix</Ariakit.Heading>
								</M3.ListItemContentTitle>
								<M3.ListItemContentSubtitle>
									remix.run
								</M3.ListItemContentSubtitle>
							</M3.ListItemContent>
						</M3.ListItem>
					</M3.List>
				</M3.CardHeader>
				<M3.Divider className="" />
				{Default.args.children}
				<M3.Divider className="" />
				<M3.CardFooter>
					<a
						href="."
						onClick={(e) => {
							e.preventDefault()
							click(e)
						}}
						className="underline"
					>
						Visit source code on GitHub.{" "}
						<MaterialSymbolsOpenInNew className="i-inline inline" />
					</a>
				</M3.CardFooter>
			</>
		),
	},
}
