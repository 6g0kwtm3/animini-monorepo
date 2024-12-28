import { Card } from "~/components/Card"
import { FieldText, FieldTextIcon } from "~/components/TextField"

import MaterialSymbolsSearch from "~icons/material-symbols/search"

import type { Meta, StoryObj } from "@storybook/react"
import type { ReactNode } from "react"
import MaterialSymbolsKeyboardVoice from "~icons/material-symbols/keyboard-voice"

const meta = {
	title: "Example/TextField",
	component: FieldText,
	//@ts-expect-error react@rc
	subcomponents: { FieldTextIcon },
	parameters: {
		// Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
	},
	// This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
	tags: ["autodocs"],
	// More on argTypes: https://storybook.js.org/docs/api/argtypes
	argTypes: {
		variant: {
			options: ["filled", "outlined"],
			control: { type: "radio" }, // or type: inline-radio
			defaultValue: "filled",
		},
	},
} satisfies Meta<typeof FieldText>

export default meta

function Prose(props: { children: ReactNode }) {
	return (
		<div className="prose [[data-theme='dark']_&]:prose-invert" {...props} />
	)
}

type Story = StoryObj<typeof meta>

export const Filled: Story = {
	args: {
		label: "Label text",
		leading: (
			<FieldTextIcon>
				<MaterialSymbolsSearch />
			</FieldTextIcon>
		),
	},
}

export const Variants: Story = {
	args: {
		label: "Text field",
		trailing: null,
	},
	render: (args) => (
		<>
			<FieldText {...args} defaultValue={"Filled"} variant="filled" />
			<FieldText {...args} defaultValue={"Outlined"} variant="outlined" />
		</>
	),
	decorators: [
		(Story) => (
			<div className="flex flex-wrap gap-2 rtl:flex-row-reverse">
				<Story />
			</div>
		),
	],
}

export const States: Story = {
	...Variants,
	args: {
		label: "Label text",
		leading: (
			<FieldTextIcon>
				<MaterialSymbolsSearch />
			</FieldTextIcon>
		),
	},
	render: (args) => (
		<>
			<FieldText {...args} />
			<FieldText {...args} data-focus-visible={true} />
			<FieldText {...args} aria-disabled={true} />
		</>
	),
}

export const StatesPopulated: Story = {
	...States,
	args: { ...States.args, defaultValue: "Input text" },
}

export const StatesOutlined: Story = {
	...States,
	args: { ...States.args, variant: "outlined" },
}

export const StatesOutlinedPopulated: Story = {
	...StatesPopulated,
	args: { ...StatesPopulated.args, variant: "outlined" },
}

export const ErrorStates: Story = {
	...States,
	args: {
		...States.args,
		"aria-invalid": "true",
	},
}

export const FilledFocused: Story = {}
FilledFocused.args = {
	...Filled.args,
						// @ts-expect-error
	"data-focus-visible": "true",
}

export const FilledDisabled: Story = {}
FilledDisabled.args = {
	...Filled.args,
	disabled: true,
	"aria-disabled": true,
}

export const FilledPopulated: Story = {}
FilledPopulated.args = {
	...Filled.args,
	defaultValue: "Input text",
}

export const FilledFocusedPopulated: Story = {}
FilledFocusedPopulated.args = {
	...FilledFocused.args,
	...FilledPopulated.args,
}

export const FilledDisabledPopulated: Story = {}
FilledDisabledPopulated.args = {
	...FilledDisabled.args,
	...FilledPopulated.args,
}

export const FilledError: Story = {}
FilledError.args = {
	...Filled.args,
	"aria-invalid": "true",
}

export const FilledFocusedError: Story = {}
FilledFocusedError.args = {
	...FilledFocused.args,
	...FilledError.args,
}

export const FilledPopulatedError: Story = {}
FilledPopulatedError.args = {
	...FilledPopulated.args,
	...FilledError.args,
}

export const FilledFocusedPopulatedError: Story = {}
FilledFocusedPopulatedError.args = {
	...FilledFocused.args,
	...FilledPopulated.args,
	...FilledError.args,
}

export const Outlined: Story = {
	args: {
		...Filled.args,
		variant: "outlined",
	},
}

export const OutlinedFocused: Story = {}
OutlinedFocused.args = {
	...FilledFocused.args,
	...Outlined.args,
}

export const OutlinedDisabled: Story = {}
OutlinedDisabled.args = {
	...FilledDisabled.args,
	...Outlined.args,
}

export const OutlinedPopulated: Story = {}
OutlinedPopulated.args = {
	...FilledPopulated.args,
	...Outlined.args,
}

export const OutlinedFocusedPopulated: Story = {}
OutlinedFocusedPopulated.args = {
	...FilledFocusedPopulated.args,
	...Outlined.args,
}

export const OutlinedDisabledPopulated: Story = {}
OutlinedDisabledPopulated.args = {
	...FilledDisabledPopulated.args,
	...Outlined.args,
}

export const OutlinedError: Story = {}
OutlinedError.args = {
	...FilledError.args,
	...Outlined.args,
}

export const OutlinedFocusedError: Story = {}
OutlinedFocusedError.args = {
	...FilledFocusedError.args,
	...Outlined.args,
}

export const OutlinedPopulatedError: Story = {}
OutlinedPopulatedError.args = {
	...FilledPopulated.args,
	...FilledError.args,
	...Outlined.args,
}

export const OutlinedFocusedPopulatedError: Story = {}
OutlinedFocusedPopulatedError.args = {
	...FilledError.args,
	...FilledFocused.args,
	...FilledPopulated.args,
	...Outlined.args,
}
export const FilledIconSignifier: Story = {}
FilledIconSignifier.args = {
	type: "date",
}
export const FilledValidOrErrorIcon: Story = {}
FilledValidOrErrorIcon.args = {
	...FilledError.args,
	leading: null,
}
export const FilledClearIcon: Story = {}
FilledClearIcon.args = {
	...FilledPopulated.args,
	leading: null,
}
export const FilledVoiceInput: Story = {}
export const FilledDropdownIcon: Story = {}
export const FilledImage: Story = {}

export const SuffixAmount: Story = {}
SuffixAmount.args = {
	variant: "outlined",
	label: "Amount",
	trailing: "/100",
}
export const SuffixAmountPopulated: Story = {}
SuffixAmountPopulated.args = {
	...SuffixAmount.args,
	defaultValue: "55",
}

export const SuffixEmail: Story = {}
SuffixEmail.args = {
	variant: "outlined",
	label: "Email",
	trailing: "@gmail.com",
}
export const SuffixEmailPopulated: Story = {}
SuffixEmailPopulated.args = {
	...SuffixEmail.args,
	defaultValue: "user",
}

export const PrefixPrice: Story = {}
PrefixPrice.args = {
	variant: "outlined",
	trailing: null,
	label: "Price",
	leading: "€",
}
export const PrefixPricePopulated: Story = {}
PrefixPricePopulated.args = {
	...PrefixPrice.args,

	defaultValue: "20",
}

export const Readme = {
	render: () => (
		<div>
			<Prose>
				<h1>{"Overview"}</h1>
				<ul>
					<li>{"Make sure text fields look interactive"}</li>
					<li>{"Two types: filled and outlined"}</li>
					<li>
						{
							"The text field’s state (blank, with input, error, etc) should be visible at a glance"
						}
					</li>
					<li>{"Keep labels and error messages brief and easy to act on"}</li>
					<li>{"Text fields commonly appear in forms and dialogs"}</li>
				</ul>
			</Prose>
			<Card
				variant="outlined"
				className="my-8 grid grid-cols-2 justify-items-center gap-2 force:py-8"
			>
				<FieldText
					{...Filled.args}
					defaultValue={"Filled"}
					leading={null}
					trailing={null}
				/>
				<FieldText
					{...Outlined.args}
					defaultValue={"Outlined"}
					leading={null}
					trailing={null}
				/>
			</Card>
			<Prose>
				<h1>{"Specs"}</h1>
				<h2>{"Filled text field"}</h2>
			</Prose>
			<Card
				variant="outlined"
				className="my-8 grid grid-cols-2 justify-items-center gap-2 force:py-8"
			>
				<FieldText {...Filled.args} />
				<FieldText {...FilledFocusedPopulated.args} />
			</Card>

			<Prose>
				<h2>{"Filled text field states"}</h2>
			</Prose>
			<Card
				variant="outlined"
				className="my-8 grid grid-cols-3 justify-items-center gap-2 force:py-8"
			>
				<FieldText {...Filled.args} />
				<FieldText {...FilledFocused.args} />
				<FieldText {...FilledDisabled.args} />
				<FieldText {...FilledPopulated.args} />
				<FieldText {...FilledFocusedPopulated.args} />
				<FieldText {...FilledDisabledPopulated.args} />
			</Card>
			<Prose>
				<h2>Filled text field error states</h2>
			</Prose>
			<Card
				variant="outlined"
				className="my-8 grid grid-cols-2 justify-items-center gap-2 force:py-8"
			>
				<FieldText {...FilledError.args} />
				<FieldText {...FilledFocusedError.args} />
				<FieldText {...FilledPopulatedError.args} />
				<FieldText {...FilledFocusedPopulatedError.args} />
			</Card>

			<Prose>
				<h3>{"Filled text field configurations"}</h3>
			</Prose>

			<Card
				variant="outlined"
				className="my-8 grid grid-cols-2 justify-items-center gap-2 force:py-8"
			>
				<FieldText />
			</Card>

			<Prose>
				<h2>{"Outlined text field"}</h2>
			</Prose>
			<Card
				variant="outlined"
				className="my-8 grid grid-cols-2 justify-items-center gap-2 force:py-8"
			>
				<FieldText {...Outlined.args} />
				<FieldText {...OutlinedFocusedPopulated.args} />
			</Card>

			<Prose>
				<h2>{"Outlined text field states"}</h2>
			</Prose>
			<Card
				variant="outlined"
				className="my-8 grid grid-cols-3 justify-items-center gap-2 force:py-8"
			>
				<FieldText {...Outlined.args} />
				<FieldText {...OutlinedFocused.args} />
				<FieldText {...OutlinedDisabled.args} />
				<FieldText {...OutlinedPopulated.args} />
				<FieldText {...OutlinedFocusedPopulated.args} />
				<FieldText {...OutlinedDisabledPopulated.args} />
			</Card>
			<Prose>
				<h2>Outlined text field error states</h2>
			</Prose>
			<Card
				variant="outlined"
				className="my-8 grid grid-cols-2 justify-items-center gap-2 force:py-8"
			>
				<FieldText {...OutlinedError.args} />
				<FieldText {...OutlinedFocusedError.args} />
				<FieldText {...OutlinedPopulatedError.args} />
				<FieldText {...OutlinedFocusedPopulatedError.args} />
			</Card>

			<Prose>
				<h1>Guidlines</h1>
				<h2>Prefix text</h2>
			</Prose>
			<Card
				variant="outlined"
				className="my-8 grid justify-items-center gap-2 force:py-8"
			>
				<FieldText {...PrefixPricePopulated.args} />
			</Card>

			<Prose>
				<h2>Suffix text</h2>
			</Prose>
			<Card
				variant="outlined"
				className="my-8 grid grid-cols-2 justify-items-center gap-2 force:py-8"
			>
				<FieldText {...SuffixAmountPopulated.args} />
				<FieldText {...SuffixEmailPopulated.args} />
			</Card>
			<Prose>
				<h2>Icons & images</h2>
			</Prose>
			<Card
				variant="outlined"
				className="my-8 grid list-decimal grid-flow-col grid-rows-3 justify-items-center gap-2 force:py-8"
			>
				<FieldText {...FilledIconSignifier.args} />
				<FieldText {...FilledValidOrErrorIcon.args} />
				<FieldText {...FilledClearIcon.args} />
				<FieldText {...FilledVoiceInput.args} />
				<FieldText {...FilledDropdownIcon.args} />
				<FieldText {...FilledImage.args} />
			</Card>
			<Card
				variant="outlined"
				className="my-8 grid list-decimal grid-flow-col grid-rows-3 justify-items-center gap-2 force:py-8"
			>
				<FieldText
					{...Outlined.args}
					trailing={
						<>
							<FieldTextIcon>
								<MaterialSymbolsKeyboardVoice />
							</FieldTextIcon>
							<FieldTextIcon>
								<MaterialSymbolsSearch />
							</FieldTextIcon>
						</>
					}
				/>
			</Card>
		</div>
	),
}

// MDXContent.storyName = "Readme";
