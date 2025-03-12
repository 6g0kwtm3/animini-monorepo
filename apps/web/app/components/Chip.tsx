import * as Ariakit from "@ariakit/react"
import {
	createContext,
	use,
	useState,
	type ComponentProps,
	type Dispatch,
	type ReactNode,
	type SetStateAction,
} from "react"
import MaterialSymbolsCheck from "~icons/material-symbols/check"
import { Label, LabelId } from "./Label"
const FocusContext = createContext<Dispatch<SetStateAction<boolean>>>(() => {})

export function ChipFilter(
	props: Omit<ComponentProps<typeof Label>, "data-focus-visible">
): ReactNode {
	const [focusVisible, setFocusVisible] = useState(false)

	return (
		<FocusContext value={setFocusVisible}>
			<Label
				{...props}
				data-focus-visible={focusVisible || undefined}
				className="border-outline text-label-lg text-on-surface-variant duration-md ease-standard-decelerate has-checked:bg-secondary-container has-checked:text-on-secondary-container hover:[&:not(\\\\#)]:state-hover has-focused:[&:not(\\\\#)]:state-focus has-checked:border-0 has-checked:shadow-sm flex h-8 items-center gap-2 rounded-sm border px-4 shadow-sm"
			/>
		</FocusContext>
	)
}

export function ChipFilterCheckbox(
	props: Omit<Ariakit.CheckboxProps, "id" | "onFocusVisible" | "onBlur">
): ReactNode {
	const setFocusVisible = use(FocusContext)
	const id = use(LabelId)
	return (
		<>
			<Ariakit.VisuallyHidden className="peer">
				<Ariakit.Checkbox
					clickOnEnter
					{...props}
					id={id}
					onFocusVisible={() => setFocusVisible(true)}
					onBlur={() => setFocusVisible(false)}
				/>
			</Ariakit.VisuallyHidden>
			<ChipFilterIcon />
		</>
	)
}

export function ChipFilterRadio(
	props: Omit<Ariakit.RadioProps, "id" | "onFocusVisible" | "onBlur">
): ReactNode {
	const setFocusVisible = use(FocusContext)
	const id = use(LabelId)
	return (
		<>
			<Ariakit.VisuallyHidden className="peer">
				<Ariakit.Radio
					clickOnEnter
					{...props}
					id={id}
					onFocusVisible={() => setFocusVisible(true)}
					onBlur={() => setFocusVisible(false)}
				/>
			</Ariakit.VisuallyHidden>
			<ChipFilterIcon />
		</>
	)
}

export function ChipFilterIcon(): ReactNode {
	return (
		<div className="ease-standard-accelerate i-[1.125rem] peer-has-checked:w-[1.125rem] peer-has-checked:opacity-100 -ms-2 w-0 opacity-0 transition-all">
			<MaterialSymbolsCheck />
		</div>
	)
}
