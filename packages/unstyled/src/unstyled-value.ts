export type Value<T extends number | string = number | string> =
	| T
	| { [key: string]: undefined | Value<T>; base?: T }

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
