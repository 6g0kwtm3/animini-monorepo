export function numberToString(n: number): string {
	return String(n)
}

export function emptyStringToUndefined<T>(
	s: string | T
): string | T | undefined {
	return s === "" ? undefined : s
}
