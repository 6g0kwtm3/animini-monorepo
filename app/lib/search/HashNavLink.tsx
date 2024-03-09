import type { NavLink } from "@remix-run/react"
import {
	Link,
	unstable_useViewTransitionState,
	useLocation,
	useNavigation,
	useResolvedPath
} from "@remix-run/react"
import { Predicate } from "effect"
import type { ComponentPropsWithoutRef } from "react"
import { forwardRef } from "react"

export const HashNavLink = forwardRef<
	HTMLAnchorElement,
	Omit<ComponentPropsWithoutRef<typeof Link>, "children"> & {
		children?: ComponentPropsWithoutRef<typeof NavLink>["children"]
	}
>(function HashNavLink({ children, ...props }, ref) {
	const { hash, pathname } = useLocation()

	const path = useResolvedPath(props.to, { relative: props.relative })
	const isActive = path.hash === hash && path.pathname === pathname

	const isTransitioning = unstable_useViewTransitionState(path)
	const navigation = useNavigation()
	const isPending =
		navigation.state === "loading" &&
		path.hash === navigation.location.hash &&
		path.pathname === navigation.location.pathname

	return (
		<Link ref={ref} {...props} aria-current={isActive ? "page" : undefined}>
			{Predicate.isFunction(children)
				? children({
						isActive: isActive,
						isTransitioning,
						isPending
					})
				: children}
		</Link>
	)
})
