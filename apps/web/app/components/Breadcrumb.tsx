import { A } from "@anitrove/a"
import { utilities } from "@anitrove/design"
import { precompileStyles } from "@anitrove/unstyled"
import { Box, } from "@anitrove/unstyled/box"
import { Role, type RoleProps } from "@ariakit/react"
import type { ComponentProps } from "react"
import { useLocation, useResolvedPath } from "react-router"

export function Breadcrumb(props: RoleProps<"nav">) {
	return (
		<Role.nav aria-label="Breadcrumb" {...props}>
			<Box
				render={<Role.ol>{props.children}</Role.ol>}
				style={precompileStyles({ ...utilities.lineClamp(1) })}
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
			style={precompileStyles({
				...utilities.marginX({ "&:before": "0.25rem" }),
				display: "inline-block",
				content: { "&:first-child": { "&::before": "''" }, "&::before": "'/'" },
			})}
		></Box>
	)
}
