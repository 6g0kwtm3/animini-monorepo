import type { NavLink } from "react-router"
import {
	Link,
	useViewTransitionState,
	useLocation,
	useNavigation,
	useResolvedPath,
} from "react-router"
import type { ComponentPropsWithoutRef } from "react"
import { forwardRef } from "react"
import * as Predicate from "~/lib/Predicate"

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
			{Predicate.isFunction(children)
				? children({
						isActive: isActive,
						isTransitioning,
						isPending,
					})
				: children}
		</Link>
	)
})
