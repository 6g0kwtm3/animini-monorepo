import type { PreCompiledStyles } from "./unstyled-print"

import { printRawStyles } from "./unstyled-print"

import { numberOrStringToString } from "utilities"
import { mapValue, type Value } from "./unstyled-value"
// export interface NextProperties extends CSS.Properties<never, never> {
// 	[key: `--${string}`]: string | number
// }

export interface Properties {
	[key: `--${string}`]: number | string | undefined
	[key: string]: number | string | undefined
}

export type RawStyles = { [K in keyof Properties]?: Value }

type NonEmptyArray<T> = [T, ...T[]]

export function defineCva<
	Variants extends Record<Exclude<string, "css">, Record<string, RawStyles>>,
>(cva: {
	base: RawStyles
	compoundVariants: ({
		[K in keyof Variants]?: NonEmptyArray<keyof Variants[K]>
	} & { css: RawStyles })[]
	defaultVariants?: { [K in keyof Variants]: keyof Variants[K] }
	variants: Variants
}): {
	base: RawStyles
	compoundVariants: ({
		[K in keyof Variants]?: NonEmptyArray<keyof Variants[K]>
	} & { css: RawStyles })[]
	defaultVariants?: { [K in keyof Variants]: keyof Variants[K] }
	variants: Variants
} {
	return cva
}

type CompoundVariant<Variants> = {
	[K in keyof Variants]?: NonEmptyArray<keyof Variants[K]>
} & { css: RawStyles }

export function cva<
	Variants extends Record<Exclude<string, "css">, Record<string, RawStyles>>,
>(cva: {
	base: RawStyles
	compoundVariants?: CompoundVariant<Variants>[]
	defaultVariants?: { [K in keyof Variants]?: keyof Variants[K] }
	variants: Variants
}): PreCompiledStyles {
	const { base, variants, defaultVariants = {}, compoundVariants = [] } = cva

	const result: RawStyles = { ...base }

	for (const [variant, option] of Object.entries<string>(defaultVariants)) {
		result[`--${variant}`] = `var(--${variant}-${option})`
	}

	for (const [variant, options] of Object.entries(variants)) {
		const properties = new Set<string>()
		for (const [option, style] of Object.entries(options)) {
			result[`--${variant}-${option}`] = `var(--${variant},)`

			for (const property in style) {
				properties.add(property)
			}
		}
		for (const property of properties) {
			result[property] = Object.entries(options)
				.flatMap(([option, style]) => {
					const value = style[property] ?? base[property]
					if (value == undefined) return []
					return [
						mapValue(value, (value) => {
							return `var(--${variant}-${option}, ${numberOrStringToString(value)})`
						}),
					]
				})
				.reduce(mergeValues)
		}
	}

	const variantsByProperty: Record<string, Set<string>> = {}

	for (const { css, ...compoundVariant } of compoundVariants) {
		for (const property in css) {
			variantsByProperty[property] ??= new Set()
			for (const variant in compoundVariant) {
				variantsByProperty[property].add(variant)
			}
		}
	}

	for (const [property, variant] of Object.entries(variantsByProperty)) {
		result[property] = mergeCompoundVariantProperty(
			base,
			variants,
			compoundVariants,
			property,
			[...variant]
		)
	}

	return printRawStyles(result)
}

function mergeCompoundVariantProperty<
	Variants extends Record<string, Record<string, RawStyles>>,
>(
	base: RawStyles,
	variants: Variants,
	compoundVariants: CompoundVariant<Variants>[],
	property: string,
	propertyVariants: string[],
	index = 0,
	currentOptions: string[] = []
): undefined | Value {
	if (index === propertyVariants.length) {
		return (
			compoundVariants
				.filter(({ css: _, ...compoundVariant }) => {
					for (const variant in compoundVariant) {
						const options = compoundVariant[variant]
						if (options === undefined) continue
						const i = propertyVariants.indexOf(variant)
						if (i === -1) {
							return false
						}
						if (!options.includes(currentOptions[i]!)) {
							return false
						}
					}
					return true
				})
				.reduceRight<undefined | Value>((acc, compoundVariant) => {
					return acc ?? compoundVariant.css[property]
				}, undefined)
			?? currentOptions.reduceRight<undefined | Value>(
				(acc, variant, i): undefined | Value =>
					acc ?? variants[propertyVariants[i]!]![variant]![property],
				undefined
			)
			?? base[property]
		)
	}
	const variant = propertyVariants[index]!

	const result = Object.keys(variants[variant]!).flatMap((option) => {
		const value = mergeCompoundVariantProperty(
			base,
			variants,
			compoundVariants,
			property,
			propertyVariants,
			index + 1,
			[...currentOptions, option]
		)
		if (value == undefined) {
			return []
		}
		return [
			mapValue(
				value,
				(value): number | string =>
					`var(--${variant}-${option}, ${numberOrStringToString(value)})`
			),
		]
	})

	if (!result.length) {
		return undefined
	}

	return result.reduce(mergeValues)
}

function mergeValues<T extends number | string>(a: T, b: T): T
function mergeValues(a: Value, b: Value): Value
function mergeValues(a: Value, b: Value): Value {
	a ??= { base: a }
	b ??= { base: b }

	if (typeof a !== "object" && typeof b !== "object") {
		return `${numberOrStringToString(a)} ${numberOrStringToString(b)}`
	}

	if (typeof a !== "object") {
		a = { base: a }
	}

	if (typeof b !== "object") {
		b = { base: b }
	}

	const result: Value = {}

	for (const [property, value] of Object.entries(a)) {
		if (value === undefined) continue
		if (b[property] !== undefined) {
			result[property] = mergeValues(value, b[property])
		} else if (b.base != undefined) {
			const { base } = b
			result[property] = mapValue(value, (property) =>
				mergeValues(property, base)
			)
		} else {
			result[property] = value
		}
	}

	for (const [property, value] of Object.entries(b)) {
		if (value === undefined) continue
		if (a[property] !== undefined) {
			result[property] = mergeValues(a[property], value)
		} else if (a.base != undefined) {
			const { base } = a
			result[property] = mapValue(value, (property) =>
				mergeValues(base, property)
			)
		} else {
			result[property] = value
		}
	}

	return result
}
