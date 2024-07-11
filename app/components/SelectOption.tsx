import type { ComponentProps, ReactNode } from "react"
import { createContext, use } from "react"
import type { LazySelectOption } from "./LazySelect"

export const SelectContext = createContext<
	(
		props: ComponentProps<"option"> & ComponentProps<typeof LazySelectOption>
	) => ReactNode
>((props) => <option {...props}>{props.value}</option>)
export function SelectOption(
	props: ComponentProps<"option"> & ComponentProps<typeof LazySelectOption>
): ReactNode {
	const Option = use(SelectContext)

	return <Option {...props} />
}
