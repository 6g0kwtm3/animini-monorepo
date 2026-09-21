import {
	createContext,
	memo,
	use,
	type ComponentProps,
	type Context,
	type ReactNode,
} from "react"
import {
	Link as RouterLink,
	type ClientLoaderFunctionArgs,
	generatePath,
	type MiddlewareFunction,
	type LoaderFunctionArgs,
	RouterContextProvider,
	type Params,
} from "react-router"

export const ClientMiddleware: Context<MiddlewareFunction[]> = createContext<
	MiddlewareFunction[]
>([])
ClientMiddleware.displayName = "ClientMiddleware"

export function usePrefetch<Path extends string>(
	...[originalPath, params, onPrefetch]: [
		...Readonly<Parameters<typeof generatePath<Path>>>,
		(args: ClientLoaderFunctionArgs) => unknown,
	]
) {
	const clientMiddleware = use(ClientMiddleware)

	return (): void => {
		const url = generatePath<Path>(originalPath, params)

		const args = {
			serverLoader: (): never => {
				throw new Error("Not implemented")
			},
			pattern: originalPath,
			url: new URL(url, location.origin),
			params: params as Params,
			context: new RouterContextProvider(),
			request: new Request(url, { signal: AbortSignal.timeout(60 * 1000) }),
		} satisfies LoaderFunctionArgs & { serverLoader: () => never }

		const middlewareChain = clientMiddleware.reduceRight<
			() => Promise<unknown>
		>(
			(next, middleware) => async () => await middleware(args, next),
			async () => await onPrefetch(args)
		)

		void middlewareChain()
	}
}
