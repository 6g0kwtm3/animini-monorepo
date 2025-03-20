import * as Ariakit from "@ariakit/react"
import {
	createContext,
	use,
	useId,
	useState,
	type ComponentProps,
	type Dispatch,
	type ReactNode,
	type SetStateAction,
} from "react"
import MaterialSymbolsCheck from "~icons/material-symbols/check"

const FocusContext = createContext<Dispatch<SetStateAction<boolean>>>(() => {})
const IdContext = createContext<string>("")

export function ChipFilter(props: ComponentProps<"label">): ReactNode {
	const [focusVisible, setFocusVisible] = useState(false)
	const id = useId()
	return (
		<FocusContext value={setFocusVisible}>
			<IdContext value={id}>
				<label
					{...props}
					htmlFor={id}
					data-focus-visible={focusVisible || undefined}
					className="flex h-8 items-center gap-2 rounded-sm border border-outline px-4 text-label-lg text-on-surface-variant shadow hover:state-hover has-[:checked]:border-0 has-[:checked]:bg-secondary-container has-[:checked]:text-on-secondary-container has-[:checked]:shadow focused:state-focus"
				/>
			</IdContext>
		</FocusContext>
	)
}

export function ChipFilterCheckbox(props: Ariakit.CheckboxProps): ReactNode {
	const setFocusVisible = use(FocusContext)
	const id = use(IdContext)
	return (
		<>
			<Ariakit.VisuallyHidden className="peer">
				<Ariakit.Checkbox
					id={id}
					{...props}
					clickOnEnter
					onFocusVisible={() => setFocusVisible(true)}
					onBlur={() => setFocusVisible(false)}
				/>
			</Ariakit.VisuallyHidden>
			<ChipFilterIcon />
		</>
	)
}

export function ChipFilterRadio(props: Ariakit.RadioProps): ReactNode {
	const setFocusVisible = use(FocusContext)
	const id = use(IdContext)
	return (
		<>
			<Ariakit.VisuallyHidden className="peer">
				<Ariakit.Radio
					id={id}
					{...props}
					clickOnEnter
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
		<div className="-ms-2 w-0 opacity-0 transition-all duration-3sm ease-standard-accelerate i-[1.125rem] peer-has-[:checked]:w-[1.125rem] peer-has-[:checked]:opacity-100">
			<MaterialSymbolsCheck />
		</div>
	)
}
