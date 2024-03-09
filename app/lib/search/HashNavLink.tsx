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
	const { hash } = useLocation()
	const isActive = Predicate.isString(props.to) && props.to.endsWith(hash)
	const path = useResolvedPath(props.to, { relative: props.relative })
	const isTransitioning = unstable_useViewTransitionState(path)
	const navigation = useNavigation()
	const isPending =
		navigation.state === "loading" &&
		Predicate.isString(props.to) &&
		props.to.endsWith(navigation.location.hash)

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
