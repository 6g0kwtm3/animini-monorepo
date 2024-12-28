export function isString(value: unknown): value is string {
	return typeof value === "string"
}

export function isNumber(value: unknown): value is number {
	return typeof value === "number"
}

export function isFunction<T extends Function>(value: unknown): value is T {
	return typeof value === "function"
}
