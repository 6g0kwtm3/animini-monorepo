import * as Ariakit from "@ariakit/react"

import { createMenu } from "./menu.styles"

import type { ReactNode } from "react"

const { item } = createMenu({})
export function SelectOption(props: Ariakit.ComboboxItemProps): ReactNode {
	return (
		<Ariakit.ComboboxItem
			{...props}
			className={item({ className: "data-active-item:state-focus" })}
		/>
	)
}
