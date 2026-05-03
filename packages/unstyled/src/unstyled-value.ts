import type { Properties } from "./unstyled-cva"

export type Value<
	T extends Properties[keyof Properties] = Properties[keyof Properties],
> = T | { [key: string]: undefined | Value<T>; base?: T }

/**
 * Applies a transformation function to Value types.
 *
 * This function takes a {@link Value} (which can be a simple value or a media
 * query object) and applies a transformation function to all nested values. If
 * the Value is an object, the function is applied to each nested value,
 * preserving the media query keys.
 *
 * This is useful for transforming style values in a consistent way, such as
 * converting color values or applying a function to all style properties.
 *
 * @example
 * 	// Transforming simple values
 * 	const transformed = mapValue("none", (value) => {
 * 		return `state-${value}`
 * 	})
 * 	// Returns: "state-none"
 *
 * @example
 * 	// Transforming media query objects
 * 	const transformed = mapValue(
 * 		{ base: "value1", "&:hover": "value2" },
 * 		(value) => {
 * 			return `transformed-${value}`
 * 		}
 * 	)
 * 	// Returns: {
 * 	//   base: "transformed-value1",
 * 	//   "&:hover": "transformed-value2",
 * 	// }
 *
 * @template A - The type of input values (number or string)
 * @template B - The type of output values (number or string)
 * @param value - The {@link Value} to transform. Can be:
 *
 *   - A simple number or string value
 *   - An object with media query keys mapping to nested {@link Value} objects or
 *     simple values
 *
 * @param fn - Transformation function that takes an input value and returns a
 *   transformed value. The function receives each value individually and should
 *   return the transformed version.
 * @returns A new {@link Value} object with the same structure as the input but
 *   with transformed values. If the input was a simple value, the output is
 *   also a simple value. If the input was an object, the output preserves all
 *   media query keys with transformed values.
 */
export function mapValue<A extends number | string, B extends number | string>(
	value: Value<A>,
	fn: (a: A) => B
): Value<B> {
	if (typeof value === "object") {
		return Object.fromEntries(
			Object.entries(value).flatMap(([media, value]) => {
				if (value === undefined) return []
				return [[media, mapValue(value, fn)]]
			})
		)
	}
	return fn(value)
}
