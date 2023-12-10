export function classes(...classes: (string | 0 | undefined | null | false)[]) {
	return classes.filter(Boolean).join(" ")
}
