import * as Ariakit from "@ariakit/react"
import type { ComponentPropsWithoutRef } from "react"
import { TouchTarget } from "./Tooltip"

export function Checkbox(
	props: ComponentPropsWithoutRef<typeof Ariakit.Checkbox>
) {
	return (
		<label className="group relative">
			<Ariakit.VisuallyHidden>
				<Ariakit.Checkbox {...props} />
			</Ariakit.VisuallyHidden>
			<div className="i hidden text-primary ifill group-has-[:checked]:block">
				check_box
			</div>
			<div className="i hidden group-has-[input:not(:checked)]:block">
				check_box_outline_blank
			</div>
			<div className="i hidden ifill group-has-[:indeterminate]:block">
				indeterminate_check_box
			</div>
			<TouchTarget></TouchTarget>
		</label>
	)
}
