import * as Ariakit from "@ariakit/react"

import { type ComponentPropsWithoutRef, type ReactNode } from "react"
import { menu } from "~/lib/menu"
import { textField } from "~/lib/textField"
import { SelectContext } from "./SelectOption"
const { input } = textField({})
const { root } = menu()

export default function LazySelect({
	children,
	...props
}: ComponentPropsWithoutRef<typeof Ariakit.Select> & {
	children: ReactNode
	name: string
}) {
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
				<SelectContext.Provider value={LazySelectOption}>
					{children}
				</SelectContext.Provider>
			</Ariakit.SelectPopover>
		</>
	)
}

const { item } = menu({})

function LazySelectOption(
	props: ComponentPropsWithoutRef<typeof Ariakit.SelectItem>,
) {
	return (
		<Ariakit.SelectItem
			{...props}
			className={item({
				className: "data-[active-item]:state-focus",
			})}
		/>
	)
}
