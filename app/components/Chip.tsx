import * as Ariakit from "@ariakit/react"
import type { ComponentPropsWithoutRef, ReactNode } from "react"
import MaterialSymbolsCheck from "~icons/material-symbols/check"

export function ChipFilter(
	props: ComponentPropsWithoutRef<"label">
): ReactNode {
	return (
		<label
			{...props}
			className="flex h-8 items-center gap-2 rounded-sm border border-outline px-4 text-label-lg text-on-surface-variant shadow outline-1 outline-primary duration-md ease-standard-decelerate has-[:checked]:border-0 has-[:checked]:bg-secondary-container has-[:checked]:text-on-secondary-container has-[:checked]:shadow has-focused:outline has-focused:outline-offset-4 motion-safe:transition-[outline-offset] hover:[&:not(\\\\\\\\\\\\\\\\#)]:state-hover has-focused:[&:not(\\\\\\\\\\\\\\\\#)]:state-focus"
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
		<div className="-ms-2 w-0 opacity-0 transition-all ease-standard-accelerate i-[1.125rem] peer-has-[:checked]:w-[1.125rem] peer-has-[:checked]:opacity-100">
			<MaterialSymbolsCheck />
		</div>
	)
}
