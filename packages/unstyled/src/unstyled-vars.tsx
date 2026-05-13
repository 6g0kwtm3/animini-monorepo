import { numberOrStringToString, numberToString } from "utilities"

export type Vars<Vars extends Record<string, number | string>> = {
	[K in keyof Vars]: Var<Vars[K]>
}

export class Var<_T extends number | string> {
	/** @internal */
	public name: string
	constructor(name: string) {
		this.name = name
	}
}

export function is<T extends number | string>(
	_var: Var<T>,
	...values: readonly [T, ...T[]]
) {
	return `@container ${values.map((value) => `style(--${_var.name}: ${numberOrStringToString(value)})`).join(" or ")}`
}
