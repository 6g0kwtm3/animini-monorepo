import * as Ariakit from "@ariakit/react"
import type { ReactNode } from "react"
import MaterialSymbolsCheckBox from "~icons/material-symbols/check-box"
import MaterialSymbolsCheckBoxOutlineBlank from "~icons/material-symbols/check-box-outline-blank"
import MaterialSymbolsIndeterminateCheckBox from "~icons/material-symbols/indeterminate-check-box"
import { TouchTarget } from "./Tooltip"

import MaterialSymbolsRadioButtonCheckedOutline from "~icons/material-symbols/radio-button-checked-outline"

import MaterialSymbolsCircleOutline from "~icons/material-symbols/circle-outline"

export function Checkbox(props: Ariakit.CheckboxProps): ReactNode {
	return (
		<label className="group relative">
			<Ariakit.VisuallyHidden>
				<Ariakit.Checkbox {...props} />
			</Ariakit.VisuallyHidden>
			<div className="hidden text-primary i group-has-checked:block">
				<MaterialSymbolsCheckBox />
			</div>
			<div className="hidden i group-has-[input:not(:checked)]:block">
				<MaterialSymbolsCheckBoxOutlineBlank />
			</div>
			<div className="hidden i group-has-indeterminate:block">
				<MaterialSymbolsIndeterminateCheckBox />
			</div>
			<TouchTarget />
		</label>
	)
}
export function Radio(props: Ariakit.RadioProps): ReactNode {
	return (
		<label className="group relative">
			<Ariakit.VisuallyHidden>
				<Ariakit.Radio {...props} />
			</Ariakit.VisuallyHidden>
			<div className="hidden text-primary i group-has-checked:block">
				<MaterialSymbolsRadioButtonCheckedOutline />
			</div>
			<div className="hidden i group-has-[input:not(:checked)]:block">
				<MaterialSymbolsCircleOutline />
			</div>

			<TouchTarget />
		</label>
	)
}
