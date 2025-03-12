import type { ComponentPropsWithoutRef, ReactNode } from "react"
import { forwardRef } from "react"
import { Link, useLocation, useResolvedPath } from "react-router"

export const HashNavLink = forwardRef<
	HTMLAnchorElement,
	ComponentPropsWithoutRef<typeof Link> & {
		children?: ReactNode
	}
>(function HashNavLink({ children, ...props }, ref) {
	const { search, pathname } = useLocation()

	const path = useResolvedPath(props.to, { relative: props.relative })
	const isActive = path.search === search && path.pathname === pathname

	return (
		<Link ref={ref} {...props} aria-current={isActive ? "page" : undefined}>
			{children}
		</Link>
	)
})
