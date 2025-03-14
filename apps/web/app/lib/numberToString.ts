export function numberToString(n: number): string {
	return String(n)
}

export function emptyStringToUndefined<T>(
	s: string | T
): undefined | string | T {
	return s === "" ? undefined : s
}
