import type { RawStyles } from "./unstyled-cva.ts"
import { precompileStyles, type OutStyles } from "./unstyled-print.ts"

export function create<const Styles extends Record<string, RawStyles>>(
	styles: Styles
): { [K in keyof Styles]: OutStyles } {
	return Object.fromEntries(
		Object.entries(styles).map(([key, style]): [string, OutStyles] => [
			key,
			precompileStyles(style),
		])
	) as { [K in keyof Styles]: OutStyles }
}
