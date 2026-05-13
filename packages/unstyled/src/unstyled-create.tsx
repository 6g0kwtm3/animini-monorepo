import type { RawStyles } from "./unstyled-cva"
import { precompileStyles, type PreCompiledStyles } from "./unstyled-print"
import type { Vars } from "./unstyled-vars"

export function create<
	const Styles extends Record<string, ((vars: any) => RawStyles) | RawStyles>,
>(
	styles: Styles
): {
	[K in keyof Styles]: Styles[K] extends RawStyles
		? PreCompiledStyles
		: Styles[K] extends (vars: Vars<infer V>) => RawStyles
			? (vars: V) => PreCompiledStyles
			: never
} {
	return Object.fromEntries(
		Object.entries(styles).map(([key, style]) => [key, precompileStyles(style)])
	)
}
