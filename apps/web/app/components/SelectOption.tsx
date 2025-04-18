import * as Ariakit from "@ariakit/react"
import type { ReactNode } from "react"
import { createMenu } from "~/lib/menu"

const { item } = createMenu({})
export function SelectOption(props: Ariakit.SelectItemProps): ReactNode {
	return (
		<Ariakit.SelectItem
			{...props}
			className={item({ className: "data-active-item:state-focus" })}
		/>
	)
}
