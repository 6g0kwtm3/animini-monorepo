import type { NavLink } from "@remix-run/react"
import {
	Link,
	unstable_useViewTransitionState,
	useLocation,
	useNavigation,
	useResolvedPath,
} from "@remix-run/react"
import { Predicate } from "effect"
import type { ComponentPropsWithRef } from "react"
import { forwardRef } from "react"

export const HashNavLink = forwardRef<
	HTMLAnchorElement,
	Omit<ComponentPropsWithRef<typeof Link>, "children"> & {
		children?: ComponentPropsWithRef<typeof NavLink>["children"]
	}
>(function HashNavLink({ children, ...props }, ref) {
	const { search, pathname } = useLocation()

	const path = useResolvedPath(props.to, { relative: props.relative })
	const isActive = path.search === search && path.pathname === pathname

	const isTransitioning = unstable_useViewTransitionState(path)
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
