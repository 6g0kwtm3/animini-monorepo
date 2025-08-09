
export type Value<T extends string | number = string | number> =
	| T
	| { base?: T; [key: string]: Value<T> | undefined }
  
export function mapValue<A extends string | number, B extends string | number>(
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
