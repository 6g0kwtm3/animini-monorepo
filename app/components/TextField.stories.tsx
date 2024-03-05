import { Card } from "./Card"
import {
	Field,
	FieldSupport,
	FieldText,
	FieldTextIcon
} from "./TextField"

import MaterialSymbolsSearch from "~icons/material-symbols/search"

import type { Story, StoryDecorator, StoryDefault } from "@ladle/react"
import type { ComponentPropsWithoutRef } from "react"

import MaterialSymbolsKeyboardVoice from "~icons/material-symbols/keyboard-voice"
import { Prose } from "./Prose"

type Props = ComponentPropsWithoutRef<typeof FieldText> & {
	variant?: "outlined" | "filled"
}

const withSupportingText: StoryDecorator<Props> = (Story) => {
	return (
		<Field>
			<Story />
			<FieldSupport>{"Supporting text"}</FieldSupport>
		</Field>
	)
}

const Template: Story<Props> = (args) => <FieldText {...args} />

export const Filled = Template.bind({})
Filled.args = {
	label: "Label text",
	leading: (
		<FieldTextIcon>
			<MaterialSymbolsSearch />
		</FieldTextIcon>
	)
}

export const FilledFocused = Template.bind({})
FilledFocused.args = {
	...Filled.args,
	"data-focus-visible": true
}

export const FilledDisabled = Template.bind({})
FilledDisabled.args = {
	...Filled.args,
	disabled: true,
	"aria-disabled": true
}

export const FilledPopulated = Template.bind({})
FilledPopulated.args = {
	...Filled.args,
	defaultValue: "Input text"
}

export const FilledFocusedPopulated = Template.bind({})
FilledFocusedPopulated.args = {
	...FilledFocused.args,
	...FilledPopulated.args
}

export const FilledDisabledPopulated = Template.bind({})
FilledDisabledPopulated.args = {
	...FilledDisabled.args,
	...FilledPopulated.args
}

export const FilledError = Template.bind({})
FilledError.args = {
	...Filled.args,
	"aria-invalid": "true"
}

export const FilledFocusedError = Template.bind({})
FilledFocusedError.args = {
	...FilledFocused.args,
	...FilledError.args
}

export const FilledPopulatedError = Template.bind({})
FilledPopulatedError.args = {
	...FilledPopulated.args,
	...FilledError.args
}

export const FilledFocusedPopulatedError = Template.bind({})
FilledFocusedPopulatedError.args = {
	...FilledFocused.args,
	...FilledPopulated.args,
	...FilledError.args
}

export const Outlined = Template.bind({})
Outlined.args = {
	...Filled.args,
	variant: "outlined"
}

export const OutlinedFocused = Template.bind({})
OutlinedFocused.args = {
	...FilledFocused.args,
	...Outlined.args
}

export const OutlinedDisabled = Template.bind({})
OutlinedDisabled.args = {
	...FilledDisabled.args,
	...Outlined.args
}

export const OutlinedPopulated = Template.bind({})
OutlinedPopulated.args = {
	...FilledPopulated.args,
	...Outlined.args
}

export const OutlinedFocusedPopulated = Template.bind({})
OutlinedFocusedPopulated.args = {
	...FilledFocusedPopulated.args,
	...Outlined.args
}

export const OutlinedDisabledPopulated = Template.bind({})
OutlinedDisabledPopulated.args = {
	...FilledDisabledPopulated.args,
	...Outlined.args
}

export const OutlinedError = Template.bind({})
OutlinedError.args = {
	...FilledError.args,
	...Outlined.args
}

export const OutlinedFocusedError = Template.bind({})
OutlinedFocusedError.args = {
	...FilledFocusedError.args,
	...Outlined.args
}

export const OutlinedPopulatedError = Template.bind({})
OutlinedPopulatedError.args = {
	...FilledPopulated.args,
	...FilledError.args,
	...Outlined.args
}

export const OutlinedFocusedPopulatedError = Template.bind({})
OutlinedFocusedPopulatedError.args = {
	...FilledError.args,
	...FilledFocused.args,
	...FilledPopulated.args,
	...Outlined.args
}
export const FilledIconSignifier = Template.bind({})
FilledIconSignifier.args = {
	type: "date"
}
export const FilledValidOrErrorIcon = Template.bind({})
FilledValidOrErrorIcon.args = {
	...FilledError.args,
	leading: null
}
export const FilledClearIcon = Template.bind({})
FilledClearIcon.args = {
	...FilledPopulated.args,
	leading: null
}
export const FilledVoiceInput = Template.bind({})
export const FilledDropdownIcon = Template.bind({})
export const FilledImage = Template.bind({})

export const SuffixAmount = Template.bind({})
SuffixAmount.args = {
	variant: "outlined",
	label: "Amount",
	trailing: "/100"
}
export const SuffixAmountPopulated = Template.bind({})
SuffixAmountPopulated.args = {
	...SuffixAmount.args,
	defaultValue: "55"
}

export const SuffixEmail = Template.bind({})
SuffixEmail.args = {
	variant: "outlined",
	label: "Email",
	trailing: "@gmail.com"
}
export const SuffixEmailPopulated = Template.bind({})
SuffixEmailPopulated.args = {
	...SuffixEmail.args,
	defaultValue: "user"
}

export const PrefixPrice = Template.bind({})
PrefixPrice.args = {
	variant: "outlined",
	trailing: null,
	label: "Price",
	leading: "€"
}
export const PrefixPricePopulated = Template.bind({})
PrefixPricePopulated.args = {
	...PrefixPrice.args,

	defaultValue: "20"
}

export const Readme = () => (
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
			className=" my-8 grid grid-cols-2 justify-items-center gap-2 force:py-8 "
		>
			<Template
				{...Filled.args}
				defaultValue={"Filled"}
				leading={null}
				trailing={null}
			/>
			<Template
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
			className=" my-8 grid grid-cols-2 justify-items-center gap-2 force:py-8 "
		>
			<Template {...Filled.args} />
			<Template {...FilledFocusedPopulated.args} />
		</Card>

		<Prose>
			<h2>{"Filled text field states"}</h2>
		</Prose>
		<Card
			variant="outlined"
			className=" my-8 grid grid-cols-3 justify-items-center gap-2 force:py-8 "
		>
			<Template {...Filled.args} />
			<Template {...FilledFocused.args} />
			<Template {...FilledDisabled.args} />
			<Template {...FilledPopulated.args} />
			<Template {...FilledFocusedPopulated.args} />
			<Template {...FilledDisabledPopulated.args} />
		</Card>
		<Prose>
			<h2>Filled text field error states</h2>
		</Prose>
		<Card
			variant="outlined"
			className=" my-8 grid grid-cols-2 justify-items-center gap-2 force:py-8 "
		>
			<Template {...FilledError.args} />
			<Template {...FilledFocusedError.args} />
			<Template {...FilledPopulatedError.args} />
			<Template {...FilledFocusedPopulatedError.args} />
		</Card>

		<Prose>
			<h3>{"Filled text field configurations"}</h3>
		</Prose>

		<Card
			variant="outlined"
			className="my-8 grid grid-cols-2 justify-items-center gap-2 force:py-8 "
		>
			<Template />
		</Card>

		<Prose>
			<h2>{"Outlined text field"}</h2>
		</Prose>
		<Card
			variant="outlined"
			className=" my-8 grid grid-cols-2 justify-items-center gap-2 force:py-8 "
		>
			<Template {...Outlined.args} />
			<Template {...OutlinedFocusedPopulated.args} />
		</Card>

		<Prose>
			<h2>{"Outlined text field states"}</h2>
		</Prose>
		<Card
			variant="outlined"
			className=" my-8 grid grid-cols-3 justify-items-center gap-2 force:py-8 "
		>
			<Template {...Outlined.args} />
			<Template {...OutlinedFocused.args} />
			<Template {...OutlinedDisabled.args} />
			<Template {...OutlinedPopulated.args} />
			<Template {...OutlinedFocusedPopulated.args} />
			<Template {...OutlinedDisabledPopulated.args} />
		</Card>
		<Prose>
			<h2>Outlined text field error states</h2>
		</Prose>
		<Card
			variant="outlined"
			className=" my-8 grid grid-cols-2 justify-items-center gap-2 force:py-8 "
		>
			<Template {...OutlinedError.args} />
			<Template {...OutlinedFocusedError.args} />
			<Template {...OutlinedPopulatedError.args} />
			<Template {...OutlinedFocusedPopulatedError.args} />
		</Card>

		<Prose>
			<h1>Guidlines</h1>
			<h2>Prefix text</h2>
		</Prose>
		<Card
			variant="outlined"
			className=" my-8 grid justify-items-center gap-2 force:py-8"
		>
			<Template {...PrefixPricePopulated.args} />
		</Card>

		<Prose>
			<h2>Suffix text</h2>
		</Prose>
		<Card
			variant="outlined"
			className=" my-8 grid grid-cols-2 justify-items-center gap-2 force:py-8"
		>
			<Template {...SuffixAmountPopulated.args} />
			<Template {...SuffixEmailPopulated.args} />
		</Card>
		<Prose>
			<h2>Icons & images</h2>
		</Prose>
		<Card
			variant="outlined"
			className=" my-8 grid list-decimal grid-flow-col grid-rows-3 justify-items-center gap-2 force:py-8"
		>
			<Template {...FilledIconSignifier.args} />
			<Template {...FilledValidOrErrorIcon.args} />
			<Template {...FilledClearIcon.args} />
			<Template {...FilledVoiceInput.args} />
			<Template {...FilledDropdownIcon.args} />
			<Template {...FilledImage.args} />
		</Card>
		<Card
			variant="outlined"
			className=" my-8 grid list-decimal grid-flow-col grid-rows-3 justify-items-center gap-2 force:py-8"
		>
			<Template
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
)
Readme.meta = {
	skip: true
}

export default {
	title: "TextField",
	argTypes: {
		variant: {
			options: ["filled", "outlined"],
			control: { type: "radio" }, // or type: inline-radio
			defaultValue: "filled"
		}
	}
} satisfies StoryDefault<Props>
// MDXContent.storyName = "Readme";
