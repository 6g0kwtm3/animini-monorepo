import * as Ariakit from "@ariakit/react"
import type { ComponentPropsWithoutRef, PropsWithChildren } from "react"

export function ChipFilter({
	children,
	...props
}: PropsWithChildren<ComponentPropsWithoutRef<typeof Ariakit.Checkbox>>) {
	return (
		<label className="flex h-8 items-center gap-2 rounded-sm border border-outline px-4 text-label-lg text-on-surface-variant shadow surface state-on-surface-variant hover:state-hover has-[:checked]:border-0 has-[:checked]:bg-secondary-container has-[:checked]:text-on-secondary-container has-[:checked]:elevation-1 has-[[data-focus-visible]]:state-focus has-[:checked]:state-on-secondary-container">
			<Ariakit.VisuallyHidden className="peer">
				<Ariakit.Checkbox {...props}></Ariakit.Checkbox>
			</Ariakit.VisuallyHidden>

			<ChipFilterIcon></ChipFilterIcon>
			{children}
		</label>
	)
}

export function ChipFilterIcon() {
	return (
		<div className="i -ms-2 w-0 opacity-0 transition-all ease-out peer-has-[:checked]:w-[1.125rem] peer-has-[:checked]:opacity-100">
			check
		</div>
	)
}
