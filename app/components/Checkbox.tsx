import * as Ariakit from "@ariakit/react"
import { use, useId, type ReactNode } from "react"
import MaterialSymbolsCheckBox from "~icons/material-symbols/check-box"
import MaterialSymbolsCheckBoxOutlineBlank from "~icons/material-symbols/check-box-outline-blank"
import MaterialSymbolsIndeterminateCheckBox from "~icons/material-symbols/indeterminate-check-box"
import { TouchTarget } from "./Tooltip"

import MaterialSymbolsRadioButtonCheckedOutline from "~icons/material-symbols/radio-button-checked-outline"

import MaterialSymbolsCircleOutline from "~icons/material-symbols/circle-outline"
import { LabelId } from "./Label"

export function Checkbox(props: Omit<Ariakit.CheckboxProps, "id">): ReactNode {
	const newId = useId()
	const id = use(LabelId) ?? newId
	return (
		<label className="group relative" htmlFor={id}>
			<Ariakit.VisuallyHidden>
				<Ariakit.Checkbox {...props} id={id} />
			</Ariakit.VisuallyHidden>
			<div className="text-primary i hidden group-has-checked:block">
				<MaterialSymbolsCheckBox />
			</div>
			<div className="i hidden group-has-[input:not(:checked)]:block">
				<MaterialSymbolsCheckBoxOutlineBlank />
			</div>
			<div className="i hidden group-has-indeterminate:block">
				<MaterialSymbolsIndeterminateCheckBox />
			</div>
			<TouchTarget />
		</label>
	)
}
export function Radio(props: Omit<Ariakit.RadioProps, "id">): ReactNode {
	const newId = useId()
	const id = use(LabelId) ?? newId
	return (
		<label className="group relative" htmlFor={id}>
			<Ariakit.VisuallyHidden>
				<Ariakit.Radio {...props} id={id} />
			</Ariakit.VisuallyHidden>
			<div className="text-primary i hidden group-has-checked:block">
				<MaterialSymbolsRadioButtonCheckedOutline />
			</div>
			<div className="i hidden group-has-[input:not(:checked)]:block">
				<MaterialSymbolsCircleOutline />
			</div>

			<TouchTarget />
		</label>
	)
}
