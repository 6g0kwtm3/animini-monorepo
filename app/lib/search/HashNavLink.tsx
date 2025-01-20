import type { ComponentPropsWithoutRef } from "react"
import { forwardRef } from "react"
import type { NavLink } from "react-router"
import {
	Link,
	useLocation,
	useNavigation,
	useResolvedPath,
	useViewTransitionState,
} from "react-router"

export const HashNavLink = forwardRef<
	HTMLAnchorElement,
	Omit<ComponentPropsWithoutRef<typeof Link>, "children"> & {
		children?: ComponentPropsWithoutRef<typeof NavLink>["children"]
	}
>(function HashNavLink({ children, ...props }, ref) {
	const { search, pathname } = useLocation()

	const path = useResolvedPath(props.to, { relative: props.relative })
	const isActive = path.search === search && path.pathname === pathname

	const isTransitioning = useViewTransitionState(path)
	const navigation = useNavigation()
	const isPending =
		navigation.state === "loading" &&
		path.search === navigation.location.search &&
		navigation.location.pathname.startsWith(path.pathname)

	return (
		<Link ref={ref} {...props} aria-current={isActive ? "page" : undefined}>
			{typeof children === "function"
				? children({
						isActive: isActive,
						isTransitioning,
						isPending,
					})
				: children}
		</Link>
	)
})
