import { use, useId, type ComponentProps } from "react"
import { LabelId } from "./LabelId.1"

export function Label(props: Omit<ComponentProps<"label">, "htmlFor">) {
	const newId = useId()
	const id = use(LabelId) ?? newId

	return (
		<LabelId value={id}>
			<label {...props} htmlFor={id}></label>
		</LabelId>
	)
}
