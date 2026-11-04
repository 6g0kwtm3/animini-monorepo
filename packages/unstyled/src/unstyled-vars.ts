import { precompileStyles, type OutStyles } from "./unstyled-print.ts"

export interface Var<T> {
	$T?: T
	name: `--${string}`
}

export interface Variant<
	T extends (number | string | boolean)[],
> extends Var<T> {
	variants: Record<ToString<T[number]>, Var<unknown>>
}

export function createVar<const T extends (number | string | boolean)[]>(
	name: `--${string}`,
	variants: T
): Variant<T> {
	return {
		name,
		variants: Object.fromEntries(
			variants.map((variant) => [variant, { name: `${name}-${variant}` }])
		) as Variant<T>["variants"],
	}
}

type ToString<T extends number | string | boolean> = T extends true
	? "true"
	: T extends false
		? "false"
		: T

export function variants<T extends (number | string | boolean)[]>(
	variable: Var<T>,
	values: Partial<Record<ToString<T[number]>, number | string>>
): string {
	return Object.entries(values)
		.map(([key, value]) => `var(${variable.name}-${key}, ${value})`)
		.join(" ")
}

export function provide<T extends (number | string | boolean)[]>(
	variable: Variant<T>,
	value: T[number]
): OutStyles {
	return {
		preCompiledStyles: precompileStyles(
			Object.fromEntries(
				Object.values<Var<unknown>>(variable.variants).map((variant) => {
					return [variant.name, `var(${variable.name},)`]
				})
			)
		).preCompiledStyles,
		dynamicVars: {
			[`${variable.name}`]: `var(${variable.name}-${String(value)})`,
		},
	}
}
