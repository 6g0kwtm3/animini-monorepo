import * as Ariakit from "@ariakit/react"
import type { ComponentPropsWithoutRef, ReactNode } from "react"
import MaterialSymbolsCheck from "~icons/material-symbols/check"

export function ChipFilter(
	props: ComponentPropsWithoutRef<"label">
): ReactNode {
	return (
		<label
			{...props}
			className="border-outline text-label-lg text-on-surface-variant outline-primary duration-md ease-standard-decelerate has-checked:bg-secondary-container has-checked:text-on-secondary-container has-focused:outline has-focused:outline-offset-4 hover:[&:not(\\#)]:state-hover has-focused:[&:not(\\#)]:state-focus flex h-8 items-center gap-2 rounded-sm border px-4 shadow-sm outline-1 has-checked:border-0 has-checked:shadow-sm motion-safe:transition-[outline-offset]"
		/>
	)
}

export function ChipFilterCheckbox(props: Ariakit.CheckboxProps): ReactNode {
	return (
		<>
			<Ariakit.VisuallyHidden className="peer">
				<Ariakit.Checkbox {...props} />
			</Ariakit.VisuallyHidden>
			<ChipFilterIcon />
		</>
	)
}

export function ChipFilterRadio(props: Ariakit.RadioProps): ReactNode {
	return (
		<>
			<Ariakit.VisuallyHidden className="peer">
				<Ariakit.Radio {...props} />
			</Ariakit.VisuallyHidden>
			<ChipFilterIcon />
		</>
	)
}

export function ChipFilterIcon(): ReactNode {
	return (
		<div className="ease-standard-accelerate i-[1.125rem] -ms-2 w-0 opacity-0 transition-all peer-has-checked:w-[1.125rem] peer-has-checked:opacity-100">
			<MaterialSymbolsCheck />
		</div>
	)
}
