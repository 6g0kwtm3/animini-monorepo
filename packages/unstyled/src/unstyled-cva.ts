import type { PreCompiledStyles } from "./unstyled-print"

import type { CSSProperties } from "react"
import { invariant, numberOrStringToString, numberToString } from "utilities"
import { precompileStyles } from "./unstyled-print"
import { mapValue, type Value } from "./unstyled-value"

export interface Properties extends CSSProperties {
	[key: `--${string}`]: number | string
	[key: string]: number | string | undefined
}

export type RawStyles = { [K in keyof Properties]?: Value<Properties[K]> }

type NonEmptyArray<T> = [T, ...T[]]

export interface Cva<
	Variants extends Record<Exclude<string, "css">, Record<string, RawStyles>>,
> {
	base: RawStyles
	compoundVariants?: ({
		[K in keyof Variants]?: NonEmptyArray<keyof Variants[K]>
	} & { css: RawStyles })[]
	defaultVariants?: { [K in keyof Variants]: keyof Variants[K] }
	variants: Variants
}

export function defineCva<
	Variants extends Record<Exclude<string, "css">, Record<string, RawStyles>>,
>(cva: Cva<Variants>): Cva<Variants> {
	return cva
}

export type CvaProps<T> =
	T extends Cva<infer Variants>
		? { readonly [K in keyof Variants]?: Value<keyof Variants[K] & string> }
		: never

export function applyProps<T>(props: CvaProps<T>): PreCompiledStyles {
	return precompileStyles(
		Object.fromEntries(
			Object.entries(props).map(([key, value]) => [
				`--${key}`,
				value && mapValue(value, (value) => `var(--${key}-${value})`),
			])
		)
	)
}

type CompoundVariant<Variants> = {
	[K in keyof Variants]?: NonEmptyArray<keyof Variants[K]>
} & { css: RawStyles }

export function cva<
	Variants extends Record<Exclude<string, "css">, Record<string, RawStyles>>,
>(
	cva: Cva<Variants>
): { style: PreCompiledStyles; variants: typeof applyProps<Cva<Variants>> } {
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
				void properties.add(property)
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
				void variantsByProperty[property].add(variant)
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

	return {
		style: precompileStyles(result),
		variants: applyProps<Cva<Variants>>,
	}
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

						const currentOption = currentOptions[i]
						invariant(
							currentOption !== undefined,
							`Expected current option for variant ${variant} to be defined`
						)

						if (!options.includes(currentOption)) {
							return false
						}
					}
					return true
				})
				.reduceRight<undefined | Value>((acc, compoundVariant) => {
					return acc ?? compoundVariant.css[property]
				}, undefined)
			?? currentOptions.reduceRight<undefined | Value>(
				(acc, variant, i): undefined | Value => {
					const propertyVariant = propertyVariants[i]
					invariant(
						propertyVariant !== undefined,
						`Expected property variant for index ${numberToString(i)} to be defined`
					)
					return acc ?? variants[propertyVariant]?.[variant]?.[property]
				},
				undefined
			)
			?? base[property]
		)
	}
	const variant = propertyVariants[index]
	invariant(
		variant !== undefined,
		`Expected variant for index ${numberToString(index)} to be defined`
	)

	const variantsVariant = variants[variant]
	invariant(
		variantsVariant !== undefined,
		`Expected variant ${variant} to be defined in variants`
	)
	const result = Object.keys(variantsVariant).flatMap((option) => {
		if (variantsVariant === undefined) {
			throw new Error(`Expected variant ${variant} to be defined in variants`)
		}
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

function mergeValues<T extends number | string | undefined>(a: T, b: T): T
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
