import type * as CSS from "csstype"
import { useId, type ReactNode } from "react"

export interface Properties extends CSS.Properties<never, never> {
	[key: `--${string}`]: string | number
}

export type Property<T extends string | number | undefined> =
	| T
	| { base?: T; [key: string]: Property<T> | undefined }

export type AllUnstyledStyles = {
	[K in keyof Properties]?: Properties[K] | Property<Properties[K]>
}

export type RawStyles = AllUnstyledStyles

export function defineCva<
	Variants extends Record<Exclude<string, "css">, Record<string, RawStyles>>,
>(cva: {
	base: RawStyles
	variants: Variants
	defaultVariants?: { [K in keyof Variants]: keyof Variants[K] }
	compoundVariants: ({ [K in keyof Variants]?: (keyof Variants[K])[] } & {
		css: RawStyles
	})[]
}) {
	return cva
}

export function cva<
	Base extends RawStyles,
	Variants extends Record<Exclude<string, "css">, Record<string, RawStyles>>,
>(cva: {
	base: Base
	variants: Variants
	defaultVariants?: { [K in keyof Variants]: keyof Variants[K] }
	compoundVariants?: ({ [K in keyof Variants]?: (keyof Variants[K])[] } & {
		css: RawStyles
	})[]
}): {
	[K in keyof Base | keyof Variants[keyof Variants]]: K extends keyof Base
		? K extends keyof Variants[keyof Variants]
			? Base[K] | Variants[keyof Variants][K]
			: Base[K]
		: K extends keyof Variants[keyof Variants]
			? Variants[keyof Variants][K]
			: never
} {
	const { base, variants, defaultVariants, compoundVariants } = cva
	const result: RawStyles = { ...base }

	for (const [propName, defaultVariant] of Object.entries(
		defaultVariants ?? {}
	)) {
		result[`--${propName}`] = `var(--${propName}-${defaultVariant})`
	}

	for (const [propName, variant] of Object.entries(variants)) {
		for (const [variantName, style] of Object.entries(variant)) {
			result[`--${propName}-${variantName}`] = `var(--${propName},)`

			for (const [propertyName, property] of Object.entries(style)) {
				result[propertyName] = mergeProperties(
					result[propertyName],
					mapProperty(
						property,
						(value) => `var(--${propName}-${variantName}, ${value})`
					)
				)
			}
		}
	}

	for (const { css, ...compoundVariant } of compoundVariants ?? []) {
		for (const [propertyName, property] of Object.entries(css)) {
			result[propertyName] = mergeProperties(
				result[propertyName],
				mapProperty(property, (value) =>
					Object.entries(compoundVariant)
						.sort(([, a], [, b]) => {
							return b.length - a.length
						})
						.reduce((acc, [propName, variants]) => {
							return variants
								.map(
									(variantName) => `var(--${propName}-${variantName}, ${acc})`
								)
								.join(" ")
						}, value)
				)
			)
		}
	}

	return result
}

function mergeProperties<T extends string | number | undefined>(
	a: Property<T>,
	b: Property<T>
): Property<T> {
	a ??= ""
	b ??= ""
	if (typeof a === "string" && typeof b === "string") {
		return `${a} ${b}`
	}
	if (typeof a === "string") {
		a = { base: a }
	}

	if (typeof b === "string") {
		b = { base: b }
	}

	const result = { ...a, ...b }

	for (const [key, value] of Object.entries(a)) {
		if (b[key]) {
			result[key] = mergeProperties(value, b[key])
		}
	}

	return result
}
export function mapProperty<
	A extends string | number | undefined,
	B extends string | number | undefined,
>(property: Property<A>, fn: (a: A) => B): Property<B> {
	if (typeof property === "object") {
		return Object.fromEntries(
			Object.entries(property).map(([key, value]) => [
				key,
				mapProperty(value, fn),
			])
		)
	}
	return fn(property)
}

export function useStyles(style: RawStyles): [string, ReactNode] {
	const id = useId()

	const className = globalThis.CSS.escape(id)

	return [className, <style href={id}>{`.${className} ${print(style)}`}</style>]
}

const tab = "  "

export function print(style: RawStyles, indent = 0) {
	let result = tab.repeat(indent) + "{\n"
	for (const [propertyName, property] of Object.entries(style)) {
		result += printProperty(
			propertyName.replaceAll(/[A-Z]/g, (match) => "-" + match.toLowerCase()),
			property,
			indent + 1
		)
	}
	result += tab.repeat(indent) + "}"
	return result
}

function printProperty(
	propertyName: string,
	property: Property<string | number | undefined>,
	indent: number
) {
	if (property == undefined) {
		return ""
	}

	if (typeof property === "string") {
		return tab.repeat(indent) + `${propertyName}: ${property};\n`
	}

	const { base, ...rest } = property

	let result = ""

	for (const [selector, property] of Object.entries(rest)) {
		result += tab.repeat(indent) + `${selector} {\n`
		result += printProperty(propertyName, property, indent + 1)
		result += tab.repeat(indent) + `}\n`
	}

	if (base) {
		result += tab.repeat(indent) + `${propertyName}: ${base};\n`
	}

	return result
}
