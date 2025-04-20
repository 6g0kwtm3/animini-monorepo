import * as Predicate from "~/lib/Predicate"
import { numberToString } from "~/lib/numberToString"

export function getCacheControl(options: {
	maxAge?: number
	staleWhileRevalidate?: number
	private?: boolean
}): string {
	const parts: string[] = []

	if (Predicate.isNumber(options.maxAge)) {
		parts.push(`max-age=${numberToString(options.maxAge)}`)

		if (Predicate.isNumber(options.staleWhileRevalidate)) {
			parts.push(`stale-while-revalidate=${numberToString(options.maxAge)}`)
		}
	}

	if (options.private) {
		parts.push("private")
	}

	const header = parts.join(", ")
	return header
}
