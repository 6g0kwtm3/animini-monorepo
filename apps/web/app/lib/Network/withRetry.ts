export type WithRetry<T> =
	| { readonly data: T; readonly kind: "Data" }
	| { readonly kind: "Retry"; readonly retryAfter: number }

export async function withRetry<T>(
	fn: () => Promise<WithRetry<T>>
): Promise<T> {
	const e = await fn()

	switch (e.kind) {
		case "Data": {
			return e.data
		}
		case "Retry": {
			await new Promise((resolve) => setTimeout(resolve, e.retryAfter * 1000))
			return withRetry(fn)
		}
	}
}
