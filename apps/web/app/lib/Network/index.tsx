import ReactRelay from "react-relay"
import { createServerEnvironment } from "react-relay/rsc_EXPERIMENTAL"
import RelayRuntime, {
	type Disposable,
	type MutationConfig,
	type MutationParameters,
	type OperationType,
} from "relay-runtime"
import environment from "./environment"

export const { readFragment } = RelayRuntime

const {
	commitMutation: commitMutation_,
	fetchQuery: fetchQuery__,
	commitLocalUpdate: commitLocalUpdate_,
} = ReactRelay

export const { useFragment, RelayEnvironmentProvider } = ReactRelay

export const { serverPreloadQuery } = createServerEnvironment(() => environment)

export { useQueryFromServer } from "react-relay/rsc-client_EXPERIMENTAL"

export function commitLocalUpdate(
	...args: Shift<Parameters<typeof commitLocalUpdate_>>
): void {
	commitLocalUpdate_(environment, ...args)
}

function commitMutation<P extends MutationParameters>(
	...args: Shift<Parameters<typeof commitMutation_<P>>>
): Disposable {
	return commitMutation_<P>(environment, ...args)
}

export function mutation<P extends MutationParameters>(
	config: MutationConfig<P>
): Promise<P["response"]> {
	return new Promise<P["response"]>((resume, reject) => {
		void commitMutation<P>({
			...config,
			onCompleted: (value) => {
				resume(value)
			},
			onError: (error) => {
				reject(error)
			},
		})
	})
}

type Shift<T> = T extends [unknown, ...infer U] ? U : []

export function fetchQuery<O extends OperationType>(
	...args: Shift<Parameters<typeof fetchQuery__<O>>>
): Promise<O["response"] | undefined> {
	return fetchQuery__<O>(environment, ...args).toPromise()
}

export default environment
