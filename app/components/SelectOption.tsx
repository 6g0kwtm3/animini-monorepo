import type { ComponentPropsWithoutRef, ReactNode } from "react"
import { createContext, useContext } from "react"
import type { LazySelectOption } from "./LazySelect"

export const SelectContext = createContext<
	(
		props: ComponentPropsWithoutRef<"option"> &
			ComponentPropsWithoutRef<typeof LazySelectOption>
	) => ReactNode
>((props) => <option {...props}>{props.value}</option>)

export function SelectOption(
	props: ComponentPropsWithoutRef<"option"> &
		ComponentPropsWithoutRef<typeof LazySelectOption>
): JSX.Element {
	const Option = useContext(SelectContext)

	return <Option {...props} />
}
