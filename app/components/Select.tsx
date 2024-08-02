import * as Ariakit from "@ariakit/react"

import type { ReactNode } from "react"

import { createMenu } from "~/lib/menu"
import { createTextFieldInput } from "~/lib/textField"

const { input } = createTextFieldInput({})
const { root } = createMenu()

export function FieldSelect({
	children,
	...props
}: Ariakit.SelectProps): ReactNode {
	return (
		<>
			<Ariakit.Select
				{...props}
				className={input({ className: "cursor-default" })}
			/>
			<Ariakit.SelectPopover
				sameWidth
				className={root({
					className:
						"z-10 max-h-[min(var(--popover-available-height,300px),300px)]",
				})}
			>
				{children}
			</Ariakit.SelectPopover>
		</>
	)
}

const { item } = createMenu({})

export function FieldSelectOption(props: Ariakit.SelectItemProps): ReactNode {
	return (
		<Ariakit.SelectItem
			{...props}
			className={item({
				className: "data-[active-item]:state-focus",
			})}
		/>
	)
}
