import { A } from "@animedes/a"
import { useLocation, useResolvedPath } from "react-router"

import type { ComponentProps } from "react"

export function HashNavLink({ children, ...props }: ComponentProps<typeof A>) {
	const { search, pathname } = useLocation()

	const path = useResolvedPath(props.href, { relative: props.relative })
	const isActive = path.search === search && path.pathname === pathname

	return (
		<A {...props} aria-current={isActive ? "page" : undefined}>
			{children}
		</A>
	)
}
