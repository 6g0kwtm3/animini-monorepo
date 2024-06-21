import type { ComponentPropsWithRef, ReactNode } from "react"
import { createContext, useContext } from "react"
import type { LazySelectOption } from "./LazySelect"

export const SelectContext = createContext<
	(
		props: ComponentPropsWithRef<"option"> &
			ComponentPropsWithRef<typeof LazySelectOption>
	) => ReactNode
>((props) => <option {...props}>{props.value}</option>)
export function SelectOption(
	props: ComponentPropsWithRef<"option"> &
		ComponentPropsWithRef<typeof LazySelectOption>
): ReactNode {
	const Option = useContext(SelectContext)

	return <Option {...props} />
}
