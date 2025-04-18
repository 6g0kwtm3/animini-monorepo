import { A } from "a"
import type { ComponentProps } from "react"
import { useLocation, useResolvedPath } from "react-router"

export function HashNavLink({ children, ...props }: ComponentProps<typeof A>) {
	const { search, pathname } = useLocation()

	const path = useResolvedPath(props.to, { relative: props.relative })
	const isActive = path.search === search && path.pathname === pathname

	return (
		<A {...props} aria-current={isActive ? "page" : undefined}>
			{children}
		</A>
	)
}
