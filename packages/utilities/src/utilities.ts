export function numberOrStringToString(value: number | string): string {
	if (typeof value === "number") {
		return numberToString(value)
	}
	return value
}
export function numberToString(n: number): string {
	return String(n)
}

export function invariant(
	condition: unknown,
	message: string
): asserts condition {
	if (!condition) {
		throw new Error(message)
	}
}
