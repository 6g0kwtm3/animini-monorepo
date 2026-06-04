import { numberOrStringToString } from "utilities"
import type { OutStyles } from "./unstyled-print.ts"
import { mapValue, type Value } from "./unstyled-value.ts"

export class Var<T extends number | string> {
	public readonly $T!: T
	/** @internal */
	public readonly name: `--var-${string}`
	constructor(name: `--var-${string}`) {
		this.name = name
	}
}

export function set<T extends number | string>(
	_var: Var<T>,
	value: Value<T>
): Record<`--${string}`, Value<string>> {
	return { [_var.name]: mapValue(value, (value) => `${value} !important`) }
}

export function is<T extends number | string>(
	_var: Var<T>,
	...values: readonly [T, ...T[]]
) {
	return `@container ${values.map((value) => `style(${_var.name}: ${numberOrStringToString(value)})`).join(" or ")}`
}

export function provide<T extends number | string>(
	_var: Var<T>,
	value: T
): OutStyles {
	return {
		preCompiledStyles: {},
		preCompiledVars: {},
		dynamicVars: { [_var.name]: numberOrStringToString(value) },
	}
}
