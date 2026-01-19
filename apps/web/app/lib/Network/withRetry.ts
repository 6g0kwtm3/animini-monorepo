export type WithRetry<T> =
	| { readonly data: T; readonly kind: "Data" }
	| { readonly kind: "Retry"; readonly retryAfter: number; cause: unknown }

export async function withRetry<T>(
	fn: () => Promise<WithRetry<T>>,
	options: { maxRetries: number }
): Promise<T> {
	const e = await fn()

	switch (e.kind) {
		case "Data": {
			return e.data
		}
		case "Retry": {
			if (options.maxRetries < 1) {
				throw new Error(`Max retries reached`, { cause: e.cause })
			}
			await new Promise((resolve) => setTimeout(resolve, e.retryAfter * 1000))
			return withRetry(fn, { maxRetries: options.maxRetries - 1 })
		}
	}
}
