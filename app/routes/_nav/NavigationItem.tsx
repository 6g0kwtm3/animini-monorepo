import { Link, type LinkProps } from "@remix-run/react"
import { createContext, type ReactNode, use } from "react"
import { NavigationContext } from "~/components"

export const ActiveId = createContext<string | undefined>(undefined)

export function NavigationItem({
	activeId: itemId,
	...props
}: LinkProps & {
	activeId: string
}): ReactNode {
	const { label } = use(NavigationContext)

	return (
		<Link
			{...props}
			className={label({
				className: props.className,
			})}
			data-current={itemId === use(ActiveId)}
		/>
	)
}