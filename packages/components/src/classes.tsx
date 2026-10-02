export function classes(
	...classes: (0 | false | null | string | undefined)[]
): string {
	return classes.filter(Boolean).join(" ")
}
