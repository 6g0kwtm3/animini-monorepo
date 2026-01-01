import { numberOrStringToString } from "utilities"
import type { Properties, RawStyles } from "./unstyled-cva"
import type { Value } from "./unstyled-value"

export type PreCompiledStyles = { [K in keyof Properties]?: string }

export function mergeStyles(
	...styles: (PreCompiledStyles | undefined)[]
): PreCompiledStyles {
	const result: PreCompiledStyles = {}
	for (const style of styles) {
		if (style === undefined) continue
		Object.assign(result, style)
	}
	return result
}

export function print(style: PreCompiledStyles): string {
	let result = "{\n"
	for (const property of Object.values(style)) {
		if (property === undefined) continue
		result += property
	}
	result += "}"
	return result
}

export function printRawStyles(style: RawStyles): PreCompiledStyles {
	return Object.fromEntries(
		Object.entries(style).flatMap(([propertyName, property]) => {
			if (property === undefined) return []

			return [
				[
					propertyName,
					printProperty(
						propertyName.replace(/([A-Z])/g, "-$1").toLowerCase(),
						property,
						1
					),
				],
			]
		})
	)
}

const tab = "  "

function printProperty(
	propertyName: string,
	property: Value,
	indent: number
): string {
	property ??= { base: property }

	if (typeof property !== "object") {
		return (
			tab.repeat(indent)
			+ `${propertyName}: ${numberOrStringToString(property)};\n`
		)
	}

	const { base, ...rest } = property

	let result = ""

	for (const [selector, property] of Object.entries<undefined | Value>(
		rest
	).reverse()) {
		if (property === undefined) continue
		result += tab.repeat(indent) + `${selector} {\n`
		result += printProperty(propertyName, property, indent + 1)
		result += tab.repeat(indent) + `}\n`
	}

	if (base != undefined) {
		result +=
			tab.repeat(indent) + `${propertyName}: ${numberOrStringToString(base)};\n`
	}

	return result
}
