import type { PreloadedQuery } from "react-relay"
import ReactRelay from "react-relay"

import RelayRuntime, {
	type Disposable,
	type MutationParameters,
	type Observable,
	type OperationType,
} from "relay-runtime"

import environment from "./environment"
import ResolverFragments from "relay-runtime/lib/store/ResolverFragments"

export const { readFragment } = ResolverFragments

const {
	commitMutation: commitMutation_,
	fetchQuery: fetchQuery__,
	loadQuery: loadQuery_,
	commitLocalUpdate: commitLocalUpdate_,
	useQueryLoader: useQueryLoader_,
} = ReactRelay

export const {
	readInlineData,
	useFragment,
	usePreloadedQuery,
	useRelayEnvironment,
} = ReactRelay

export function useQueryLoader<T extends RelayRuntime.OperationType>(
	query: ReactRelay.GraphQLTaggedNode
) {
	const [queryReference, loadQuery, disposeQuery] = useQueryLoader_<T>(query)

	return [
		queryReference &&
			([query, queryReference] satisfies NodeAndQueryFragment<T>),
		loadQuery,
		disposeQuery,
	] as const
}

export type NodeAndQueryFragment<T extends RelayRuntime.OperationType> =
	readonly [ReactRelay.GraphQLTaggedNode, PreloadedQuery<T>]

export function loadQuery<T extends RelayRuntime.OperationType>(
	query: ReactRelay.GraphQLTaggedNode,
	...args: Shift<Shift<Parameters<typeof loadQuery_<T>>>>
): NodeAndQueryFragment<T> {
	return [query, loadQuery_<T>(environment, query, ...args)]
}

export function commitLocalUpdate(
	...args: Shift<Parameters<typeof commitLocalUpdate_>>
): void {
	commitLocalUpdate_(environment, ...args)
}

export function commitMutation<P extends MutationParameters>(
	...args: Shift<Parameters<typeof commitMutation_<P>>>
): Disposable {
	return commitMutation_<P>(environment, ...args)
}

declare module "relay-runtime" {
	type ErrorResult<Error> = {
		ok: false
		errors: ReadonlyArray<Error>
	}

	type OkayResult<T> = {
		ok: true
		value: T
	}

	export type Result<T, Error> = OkayResult<T> | ErrorResult<Error>
}

type Shift<T> = T extends [any, ...infer U] ? U : []

export function fetchQuery<O extends OperationType>(
	...args: Shift<Parameters<typeof fetchQuery__<O>>>
): Observable<O["response"]> {
	return fetchQuery__<O>(environment, ...args)
}

export default environment
