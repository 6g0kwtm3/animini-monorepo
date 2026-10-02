export type WithRetry<T> =
	| {
			readonly cause: unknown
			readonly kind: "Retry"
			readonly retryAfter: number
	  }
	| { readonly data: T; readonly kind: "Data" }

export async function withRetry<T>(
	fn: () => Promise<WithRetry<T>>,
	options: { readonly maxRetries: number; readonly signal: AbortSignal | null }
): Promise<T> {
	options.signal?.throwIfAborted()
	const e = await fn()
	options.signal?.throwIfAborted()

	switch (e.kind) {
		case "Data": {
			return e.data
		}
		case "Retry": {
			if (options.maxRetries < 1) {
				throw new Error(`Max retries reached`, { cause: e.cause })
			}
			await new Promise<void>((resolve, reject) => {
				const controller = new AbortController()
				const timeoutId = setTimeout(() => {
					controller.abort()
					resolve()
				}, e.retryAfter * 1000)
				const signal = options.signal
				signal?.addEventListener(
					"abort",
					() => {
						clearTimeout(timeoutId)
						reject(
							Error.isError(signal.reason)
								? signal.reason
								: new Error(`Aborted`, { cause: signal.reason })
						)
					},
					{ signal: controller.signal }
				)
			})
			options.signal?.throwIfAborted()
			return withRetry(fn, {
				maxRetries: options.maxRetries - 1,
				signal: options.signal,
			})
		}
	}
}
