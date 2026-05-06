import { numberOrStringToString } from "utilities"
import type { Properties, RawStyles } from "./unstyled-cva"
import { Marker } from "./unstyled-marker"
import type { Value } from "./unstyled-value"

/**
 * Compiled styles object representing pre-processed CSS styles.
 *
 * {@link PreCompiledStyles} is a wrapper around a styles object that provides a
 * structured representation of compiled CSS. The styles property contains CSS
 * properties with values that may include CSS custom properties for variant
 * options.
 *
 * @property styles - Object mapping CSS property names to their values Values
 *   can be simple strings/numbers or CSS custom properties referencing variant
 *   options
 */
export class PreCompiledStyles {
	/** @internal */ readonly kind = "PreCompiledStyles" as const
	/** @internal */ public readonly markers = new Set<Marker>()
	/** @internal */ public readonly styles: { [K in keyof Properties]?: string }
	constructor(styles: { [K in keyof Properties]?: string }) {
		this.styles = styles
	}
}

/**
 * Merges multiple {@link PreCompiledStyles} objects into one.
 *
 * This function combines multiple style objects into a single
 * {@link PreCompiledStyles} instance by iterating over each input and assigning
 * its properties to the result. Undefined properties are skipped during the
 * merge.
 *
 * This is useful for combining base styles with variant-specific styles or
 * merging theme styles with component-specific overrides.
 *
 * @example
 * 	// Merging base and variant styles
 * 	import { mergeStyles } from "@anitrove/unstyled"
 *
 * 	const baseStyles = precompileStyles({ display: "flex", padding: ".5rem" })
 *
 * 	const variantStyles = precompileStyles({ fontSize: "1rem" })
 *
 * 	const merged = mergeStyles(baseStyles, variantStyles)
 *
 * @param styles - Variable number of PreCompiledStyles instances to merge
 * @returns PreCompiledStyles instance containing the merged styles from all
 *   input objects. The result's styles property includes properties from all
 *   inputs in the order they were provided
 */
export function mergeStyles(
	...styles: (Marker | PreCompiledStyles | undefined)[]
): PreCompiledStyles {
	const result = new PreCompiledStyles({})
	for (const style of styles) {
		if (style === undefined) continue
		switch (style.kind) {
			case "PreCompiledStyles": {
				void Object.assign(result.styles, style.styles)
				for (const marker of style.markers) {
					void result.markers.add(marker)
				}
				break
			}
			case "Marker": {
				void result.markers.add(style)
			}
		}
	}
	return result
}

/**
 * Converts {@link PreCompiledStyles} to a CSS string representation.
 *
 * This function takes a {@link PreCompiledStyles} instance and generates a CSS
 * string by iterating over all properties and values. The output CSS uses CSS
 * custom properties (CSS variables) for variant options.
 *
 * @example
 * 	// Simple styles
 * 	const styles = precompileStyles({
 * 		color: "blue",
 * 		"--size-xs": "var(--size-xs)",
 * 	})
 *
 * 	const css = print(styles)
 * 	// Output: "{\n  color: blue;\n  --size-xs: var(--size-xs);\n}"
 *
 * @param style - {@link PreCompiledStyles} instance to convert to CSS string
 * @returns CSS string representing the compiled styles. The string includes all
 *   properties with their values, using CSS custom properties for variant
 *   options in the format var(--variant-option)
 * @internal
 */
export function print(style: PreCompiledStyles): string {
	let result = "{\n"
	for (const property of Object.values(style.styles)) {
		if (property === undefined) continue
		result += property
	}
	result += "}"
	return result
}

/**
 * Compiles raw styles into {@link PreCompiledStyles} for optimized rendering.
 *
 * This function takes an object with CSS properties and their values, which can
 * include media query objects, and returns a {@link PreCompiledStyles} instance
 * that can be directly used with CSS generation functions.
 *
 * The compilation process flattens nested media query objects and creates a
 * structured representation that can be efficiently processed for CSS output.
 *
 * @example
 * 	// Simple styles
 * 	const styles = precompileStyles({ color: "blue", fontSize: "1rem" })
 *
 * @example
 * 	// Styles with media queries
 * 	const styles = precompileStyles({
 * 		color: { base: "black", "&:hover": "blue" },
 * 	})
 *
 * @example
 * 	// Styles with media queries and variants
 * 	const styles = precompileStyles({
 * 		color: {
 * 			base: "black",
 * 			"&:hover": "blue",
 * 			"@media (min-width: 768px)": { base: "white", "&:hover": "red" },
 * 		},
 * 	})
 *
 * @param style - Raw styles object where keys are CSS property names and values
 *   can be:
 *
 *   - Simple strings or numbers for direct CSS values
 *   - Objects with `base` property for responsive values
 *   - Objects with media query keys (e.g., "&:hover", "@media") for responsive
 *     variants
 *
 * @returns {@link PreCompiledStyles} Instance containing the compiled styles
 *   accessible via the `.styles` property
 */
export function precompileStyles(style: RawStyles): PreCompiledStyles {
	return new PreCompiledStyles(
		Object.fromEntries(
			Object.entries(style).flatMap(([propertyName, property]) => {
				if (property === undefined) return []

				return [
					[
						propertyName,
						printProperty(
							propertyName.replace(/([A-Z])/g, "-$1").toLowerCase(),
							property,
							1
						),
					],
				]
			})
		)
	)
}

const tab = "  "

function printProperty(
	propertyName: string,
	property: Value,
	indent: number
): string {
	property ??= { base: property }

	if (typeof property !== "object") {
		return (
			tab.repeat(indent)
			+ `${propertyName}: ${numberOrStringToString(property)};\n`
		)
	}

	const { base, ...rest } = property

	let result = ""

	if (base != undefined) {
		result +=
			tab.repeat(indent) + `${propertyName}: ${numberOrStringToString(base)};\n`
	}

	for (const [selector, property] of Object.entries<undefined | Value>(rest)) {
		if (property === undefined) continue
		result += tab.repeat(indent) + `${selector} {\n`
		result += printProperty(propertyName, property, indent + 1)
		result += tab.repeat(indent) + `}\n`
	}

	return result
}
