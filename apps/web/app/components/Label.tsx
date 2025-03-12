import { createContext, use, useId, type ComponentProps } from "react"

export const LabelId = createContext<string | undefined>(undefined)

export function Label(props: Omit<ComponentProps<"label">, "htmlFor">) {
	const newId = useId()
	const id = use(LabelId) ?? newId

	return (
		<LabelId value={id}>
			<label {...props} htmlFor={id}></label>
		</LabelId>
	)
}
