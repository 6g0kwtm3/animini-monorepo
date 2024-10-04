import { use, type ReactNode } from "react"
import { NavLink, type NavLinkProps } from "react-router"
import {
	NavigationItemActiveIndicator,
	NavigationStyles,
	TouchTarget,
} from "~/components"

export function NavigationItem(props: NavLinkProps): ReactNode {
	const styles = use(NavigationStyles)

	return (
		<NavLink
			{...props}
			className={(args) =>
				styles.label({
					className:
						typeof props.className === "function"
							? props.className(args)
							: props.className,
				})
			}
		>
			{({ isActive }) => (
				<>
					{isActive && <NavigationItemActiveIndicator />}
					{props.children}
					<TouchTarget />
				</>
			)}
		</NavLink>
	)
}
