import { Predicate } from "effect"

export function getCacheControl(options: {
	maxAge?: number
	staleWhileRevalidate?: number
	private?: boolean
}): string {
	let header = ""
	if (Predicate.isNumber(options.maxAge)) {
		header += `max-age=${options.maxAge}`
	}

	if (Predicate.isNumber(options.staleWhileRevalidate)) {
		header += `${header ? ", " : ""}stale-while-revalidate=${options.maxAge}`
	}

	if (options.private) {
		header += `${header ? ", " : ""}private`
	}

	return header
}
