import * as Ariakit from "@ariakit/react"
import type { ComponentPropsWithoutRef } from "react"
import { TouchTarget } from "./Tooltip"
import MaterialSymbolsCheckBox from "~icons/material-symbols/check-box"
import MaterialSymbolsCheckBoxOutlineBlank from "~icons/material-symbols/check-box-outline-blank"
import MaterialSymbolsIndeterminateCheckBox from "~icons/material-symbols/indeterminate-check-box"
export function Checkbox(
	props: ComponentPropsWithoutRef<typeof Ariakit.Checkbox>
) {
	return (
		<label className="group relative">
			<Ariakit.VisuallyHidden>
				<Ariakit.Checkbox {...props} />
			</Ariakit.VisuallyHidden>
			<div className="i hidden text-primary group-has-[:checked]:block">
				<MaterialSymbolsCheckBox></MaterialSymbolsCheckBox>
			</div>
			<div className="i hidden group-has-[input:not(:checked)]:block">
				<MaterialSymbolsCheckBoxOutlineBlank></MaterialSymbolsCheckBoxOutlineBlank>
			</div>
			<div className="i hidden group-has-[:indeterminate]:block">
				<MaterialSymbolsIndeterminateCheckBox></MaterialSymbolsIndeterminateCheckBox>
			</div>
			<TouchTarget></TouchTarget>
		</label>
	)
}
