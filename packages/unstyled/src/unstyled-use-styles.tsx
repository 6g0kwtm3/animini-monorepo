import { useState, type ReactNode } from "react"

import { print, type DynamicVars, type OutStyles } from "./unstyled-print"

/**
 * React hook that generates style classes for unstyled components.
 *
 * This internal hook generates a unique CSS class name and injects a style tag
 * containing the component's styles. The class name is derived from a SHA-256
 * hash of the styles to ensure consistent class names for the same styles.
 *
 * The hook uses React's useMemo to cache the result based on the input styles,
 * ensuring that identical styles produce the same class name without
 * re-generating the style tag.
 *
 * @example
 * 	// Usage in
 * 	//	components```ts
 * 	import { useStyles, precompileStyles } from "@anitrove/unstyled";
 *
 * 	const [className, styleElement] = useStyles(precompileStyles({
 * 	color: "blue",
 * 	}));
 *
 * 	return <div className={className} />;
 *
 * 	@param rawStyle - {@link OutStyles} instance containing the styles to
 * 	generate a class name for. The styles are converted to a CSS string and
 * 	injected into the document.
 * 	@returns A tuple containing:
 *
 * 	- A unique class name in the format `unstyled-{hash}`
 * 	- A React node representing a style element containing the styles
 *
 * 	@internal Box should be used instead of this hook directly. This is an internal implementation detail
 */
export function useStyles(
	rawStyle: OutStyles
): [string, ReactNode, DynamicVars] {
	return useState((): [string, ReactNode, DynamicVars] => {
		const styles = print(rawStyle)
		const thing = hash32(JSON.stringify(rawStyle.preCompiledStyles))
		const id = hex(thing)

		const className = `unstyled-${id}`

		const jsx = (
			<style
				href={className}
				precedence="medium"
			>{`.${className} ${styles}`}</style>
		)
		return [className, jsx, rawStyle.dynamicVars]
	})[0]
}

function hex(hash: bigint | number) {
	return hash.toString(16)//.padStart(16, "0")
}

export function hash32(str: string): number {
	let h = 1779033703 ^ str.length

	for (let i = 0; i < str.length; i++) {
		h = Math.imul(h ^ str.charCodeAt(i), 3432918353)
		h = (h << 13) | (h >>> 19)
	}

	return (h ^ (h >>> 16)) >>> 0
}
