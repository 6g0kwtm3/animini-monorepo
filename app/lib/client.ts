import type {
	MutationConfig,
	MutationParameters,
	OperationType,
} from "relay-runtime"
import { commitMutation, fetchQuery } from "./Network"

import environment from "./Network"
class Client {
	async query<T extends OperationType>(
		...args: [
			Parameters<typeof fetchQuery<T>>[1],
			Parameters<typeof fetchQuery<T>>[2],
			Parameters<typeof fetchQuery<T>>[3]?,
		]
	): Promise<T["response"] | undefined> {
		return client_operation(...args)
	}

	async mutation<T extends MutationParameters>(
		config: MutationConfig<T>
	): Promise<T["response"]> {
		return new Promise<T["response"]>((resolve, reject) =>
			commitMutation<T>(environment, {
				...config,
				onCompleted: (value) => resolve(value),
				onError: (error) => reject(error),
			})
		)
	}
}

export function client_get_client(): Client {
	return new Client()
}

export async function client_operation<T extends OperationType>(
	...args: [
		Parameters<typeof fetchQuery<T>>[1],
		Parameters<typeof fetchQuery<T>>[2],
		Parameters<typeof fetchQuery<T>>[3]?,
	]
): Promise<T["response"] | undefined> {
	return fetchQuery<T>(environment, ...args).toPromise()
}
