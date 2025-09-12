import { memo, type ComponentProps, type ReactNode } from "react"
import { Link as RouterLink } from "react-router"

const MemoLink: typeof RouterLink = memo(RouterLink)

interface LinkProps extends Omit<ComponentProps<typeof MemoLink>, "to"> {
	href: ComponentProps<typeof MemoLink>["to"]
}

export function A({ href, ...props }: LinkProps): ReactNode {
	return <MemoLink prefetch="intent" {...props} to={href} />
}
