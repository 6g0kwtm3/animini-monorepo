import { A } from "@anitrove/a"
import { utilities } from "@anitrove/design"
import { precompileStyles, useStyles } from "@anitrove/unstyled"
import { Role, type RoleProps } from "@ariakit/react"
import type { ComponentProps } from "react"
import { useLocation, useResolvedPath } from "react-router"

export function Breadcrumb(props: RoleProps<"nav">) {
	const [className, jsx] = useStyles(
		precompileStyles({ ...utilities.lineClamp(1) })
	)
	return (
		<Role.nav aria-label="Breadcrumb" {...props}>
			<Role.ol className={className}>{props.children}</Role.ol>
			{jsx}
		</Role.nav>
	)
}

export function BreadcrumbItem(props: ComponentProps<typeof A>) {
	const [className, jsx] = useStyles(
		precompileStyles({
			...utilities.marginX({ "&:before": "0.25rem" }),
			display: "inline-block",
			content: { "&:first-child": { "&::before": "''" }, "&::before": "'/'" },
		})
	)

	const { pathname } = useResolvedPath(props.href, { relative: props.relative })

	const location = useLocation()

	return (
		<Role.li className={className}>
			<A
				aria-current={pathname === location.pathname ? "page" : undefined}
				{...props}
			></A>
			{jsx}
		</Role.li>
	)
}
