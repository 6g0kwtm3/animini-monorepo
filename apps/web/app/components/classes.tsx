export function classes(
	...classes: (string | 0 | undefined | null | false)[]
): string {
	return classes.filter(Boolean).join(" ")
}
