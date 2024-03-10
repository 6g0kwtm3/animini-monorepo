import * as Ariakit from "@ariakit/react"
import type { ComponentPropsWithoutRef, PropsWithChildren } from "react"
import MaterialSymbolsCheck from "~icons/material-symbols/check"

export function ChipFilter({
	children,
	...props
}: PropsWithChildren<ComponentPropsWithoutRef<typeof Ariakit.Checkbox>>):JSX.Element {
	return (
		<label className="flex h-8 items-center gap-2 rounded-sm border border-outline px-4 text-label-lg text-on-surface-variant shadow has-[:checked]:border-0 has-[:checked]:bg-secondary-container has-[:checked]:text-on-secondary-container has-[:checked]:shadow hover:[&:not(\#)]:state-hover has-[[data-focus-visible]]:[&:not(\#)]:state-focus">
			<Ariakit.VisuallyHidden className="peer">
				<Ariakit.Checkbox {...props} />
			</Ariakit.VisuallyHidden>

			<ChipFilterIcon />
			{children}
		</label>
	)
}

export function ChipFilterIcon():JSX.Element {
	return (
		<div className="-ms-2 w-0 opacity-0 transition-all ease-out i-[1.125rem] peer-has-[:checked]:w-[1.125rem] peer-has-[:checked]:opacity-100">
			<MaterialSymbolsCheck />
		</div>
	)
}
