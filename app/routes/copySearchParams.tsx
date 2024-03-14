import type { ReadonlyURLSearchParams } from "./_nav.user.$userName.$typelist._filters"

export function copySearchParams(
	params: ReadonlyURLSearchParams
): URLSearchParams {
	const result = new URLSearchParams()
	for (const [key, value] of params.entries()) {
		result.append(key, value)
	}
	return result
}
