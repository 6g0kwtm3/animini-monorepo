export type WithRetry<T> =
	| { readonly kind: "Data"; readonly data: T }
	| { readonly kind: "Retry"; readonly retryAfter: number }

export async function withRetry<T>(
	fn: () => Promise<WithRetry<T>>
): Promise<T> {
	const e = await fn()

	switch (e.kind) {
		case "Retry": {
			await new Promise((resolve) => setTimeout(resolve, e.retryAfter * 1000))
			return withRetry(fn)
		}
		case "Data": {
			return e.data
		}
	}
}
