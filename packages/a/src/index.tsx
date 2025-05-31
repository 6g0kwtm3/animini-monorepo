import { memo, type ComponentProps } from "react"
import { Link as RouterLink } from "react-router"

const MemoLink = memo(RouterLink)

interface LinkProps extends Omit<ComponentProps<typeof MemoLink>, "to"> {
	href: ComponentProps<typeof MemoLink>["to"]
}

export function A({ href, ...props }: LinkProps) {
	return <MemoLink prefetch="intent" {...props} to={href} />
}
