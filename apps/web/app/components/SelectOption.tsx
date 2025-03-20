import type { ReactNode } from "react"
import { Ariakit } from "~/lib/ariakit"
import { createMenu } from "~/lib/menu"

const { item } = createMenu({})
export function SelectOption(props: Ariakit.SelectItemProps): ReactNode {
	return (
		<Ariakit.SelectItem
			{...props}
			className={item({
				className: "data-[active-item]:state-focus",
			})}
		/>
	)
}
