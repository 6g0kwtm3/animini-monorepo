import { memo, use, type ComponentProps, type ReactNode } from "react"
import { Link as RouterLink } from "react-router"
import { PrefetchProvider } from "./provider"

export interface LinkProps extends Omit<ComponentProps<typeof MemoLink>, "to"> {
	href: ComponentProps<typeof MemoLink>["to"]
}

export const MemoLink: typeof RouterLink = memo(RouterLink)

export function A({ href, ...props }: LinkProps): ReactNode {
	const prefetch = use(PrefetchProvider)
	return <MemoLink prefetch={prefetch} {...props} to={href} />
}
