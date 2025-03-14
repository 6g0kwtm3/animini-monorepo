import * as Predicate from "~/lib/Predicate"
import { numberToString } from "~/lib/numberToString"

export function getCacheControl(options: {
	maxAge?: number
	staleWhileRevalidate?: number
	private?: boolean
}): string {
	let header = ""
	if (Predicate.isNumber(options.maxAge)) {
		header += `max-age=${numberToString(options.maxAge)}`
	}

	if (Predicate.isNumber(options.staleWhileRevalidate)) {
		header += `${header ? ", " : ""}stale-while-revalidate=${numberToString(options.maxAge)}`
	}

	if (options.private) {
		header += `${header ? ", " : ""}private`
	}

	return header
}
