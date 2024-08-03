import type { Meta, StoryObj } from "@storybook/react"
import { fn } from "@storybook/test"
import { allModes } from "~/../.storybook/modes"
import { Dialog, DialogContentIcon } from "~/components/Dialog"
import { Ariakit } from "~/lib/ariakit"
import { M3 } from "~/lib/components"
import MaterialSymbolsClose from "~icons/material-symbols/close"
import MaterialSymbolsDeleteOutline from "~icons/material-symbols/delete-outline"

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
	title: "Example/Dialog",
	component: Dialog,
	// @ts-expect-error
	subcomponents: { DialogIcon: DialogContentIcon },
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
		layout: "centered",
		docs: {
			story: {
				inline: false,
				height: "400px",
			},
		},
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ["autodocs"],
	// More on argTypes: https://storybook.js.org/docs/api/argtypes
	argTypes: {},
	// Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
	args: { onClick: fn(), open: true },
} satisfies Meta<typeof Dialog>

export default meta
type Story = StoryObj<typeof meta>
// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default: Story = {
	args: {
		children: (
			<M3.DialogContent>
				<M3.DialogContentHeadline>
					<M3.DialogFullscreenIcon className="sm:hidden">
						<Ariakit.DialogDismiss>
							<div className="sr-only">Cancel</div>
							<MaterialSymbolsClose />
						</Ariakit.DialogDismiss>
					</M3.DialogFullscreenIcon>
					<span className="truncate">Create a new album</span>
					<M3.Button className="ms-auto sm:hidden">Save</M3.Button>
				</M3.DialogContentHeadline>
				<M3.DialogContentBody>
					<M3.Field>
						<M3.FieldText variant="outlined" label="Album title" />
					</M3.Field>
					<M3.Field>
						<M3.FieldText variant="outlined" label="Description" />
					</M3.Field>
					<div className="-mx-4 my-6">
						<M3.Subheader>Shared with</M3.Subheader>
						<M3.List lines={"one"} className="grid-cols-2 sm:grid">
							<M3.ListItem>
								<M3.ListItemAvatar>
									<img src="" alt="" />
								</M3.ListItemAvatar>
								<M3.ListItemContent>
									<M3.ListItemContentTitle>
										Alejandro Ortega
									</M3.ListItemContentTitle>
								</M3.ListItemContent>
							</M3.ListItem>
							<M3.ListItem>
								<M3.ListItemAvatar>
									<img src="" alt="" />
								</M3.ListItemAvatar>
								<M3.ListItemContent>
									<M3.ListItemContentTitle>
										Ines Vilanueva
									</M3.ListItemContentTitle>
								</M3.ListItemContent>
							</M3.ListItem>
							<M3.ListItem>
								<M3.ListItemAvatar>
									<img src="" alt="" />
								</M3.ListItemAvatar>
								<M3.ListItemContent>
									<M3.ListItemContentTitle>
										Carmen Vilanueva
									</M3.ListItemContentTitle>
								</M3.ListItemContent>
							</M3.ListItem>
						</M3.List>
					</div>
				</M3.DialogContentBody>
				<M3.DialogContentFooter>
					<M3.Button>Cancel</M3.Button>
					<M3.Button>Save</M3.Button>
				</M3.DialogContentFooter>
			</M3.DialogContent>
		),
		variant: {
			initial: "fullscreen",
			sm: "basic",
		},
	},
	parameters: {
		chromatic: {
			modes: {
				sm: allModes.sm,
				lg: allModes.xl,
			},
		},
	},
}
export const Delete: Story = {
	args: {
		children: (
			<M3.DialogContent>
				<M3.DialogContentIcon>
					<MaterialSymbolsDeleteOutline />
				</M3.DialogContentIcon>
				<M3.DialogContentHeadline>
					<span className="truncate">Permanently delete?</span>
				</M3.DialogContentHeadline>
				<M3.DialogContentBody>
					Deleting the selected messages will also
					<br /> remove them from all synced devices.
				</M3.DialogContentBody>
				<M3.DialogContentFooter>
					<M3.Button>Cancel</M3.Button>
					<M3.Button variant="tonal">Save</M3.Button>
				</M3.DialogContentFooter>
			</M3.DialogContent>
		),
		variant: "basic",
	},
}
