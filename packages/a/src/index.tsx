import {
	createContext,
	memo,
	use,
	type ComponentProps,
	type ReactNode,
} from "react"
import {
	Link as RouterLink,
	type ClientLoaderFunctionArgs,
	generatePath,
	type MiddlewareFunction,
	type LoaderFunctionArgs,
	RouterContextProvider,
} from "react-router"
import { ClientMiddleware } from "./prefetch"

const MemoLink: typeof RouterLink = RouterLink

interface LinkProps<Path extends string> extends Omit<
	ComponentProps<typeof MemoLink>,
	"to"
> {
	href: ComponentProps<typeof MemoLink>["to"]
	onPrefetch: () => void
}

export function A<Path extends string>({
	href,
	onPrefetch,
	prefetch,
	...props
}: LinkProps<Path>): ReactNode {
	prefetch ??= "intent"

	return (
		<MemoLink
			prefetch={prefetch}
			onMouseEnter={prefetch === "intent" ? onPrefetch : undefined}
			onFocus={prefetch === "intent" ? onPrefetch : undefined}
			{...props}
			to={href}
		/>
	)
}
