import { A } from "@anitrove/a"
import { Box } from "@anitrove/unstyled/box"
import { Role, type RoleProps } from "@ariakit/react"
import type { ComponentProps } from "react"
import { useLocation, useResolvedPath } from "react-router"
import { styles } from "./Breadcrumb.styles" with { type: "macro" }

export function Breadcrumb(props: RoleProps<"nav">) {
	return (
		<Role.nav aria-label="Breadcrumb" {...props}>
			<Box
				render={<Role.ol>{props.children}</Role.ol>}
				style={styles.breadcrumb}
			></Box>
		</Role.nav>
	)
}

export function BreadcrumbItem(props: ComponentProps<typeof A>) {
	const { pathname } = useResolvedPath(props.href, { relative: props.relative })

	const location = useLocation()

	return (
		<Box
			render={
				<Role.li>
					<A
						aria-current={pathname === location.pathname ? "page" : undefined}
						{...props}
					></A>
				</Role.li>
			}
			style={styles.item}
		></Box>
	)
}
