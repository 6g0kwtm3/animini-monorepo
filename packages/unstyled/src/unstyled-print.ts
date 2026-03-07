import { numberOrStringToString } from "utilities"
import type { Properties, RawStyles } from "./unstyled-cva"
import type { Value } from "./unstyled-value"

export declare const PreCompiledStylesBrand: unique symbol
export class PreCompiledStyles {
	constructor(
		/** @internal */ public readonly styles: {
			[K in keyof Properties]?: string
		}
	) {}
}

export function mergeStyles(
	...styles: (PreCompiledStyles | undefined)[]
): PreCompiledStyles {
	const result = new PreCompiledStyles({})
	for (const style of styles) {
		if (style === undefined) continue
		void Object.assign(result.styles, style.styles)
	}
	return result
}

export function print(style: PreCompiledStyles): string {
	let result = "{\n"
	for (const property of Object.values(style.styles)) {
		if (property === undefined) continue
		result += property
	}
	result += "}"
	return result
}

export function precompileStyles(style: RawStyles): PreCompiledStyles {
	return new PreCompiledStyles(
		Object.fromEntries(
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

	if (base != undefined) {
		result +=
			tab.repeat(indent) + `${propertyName}: ${numberOrStringToString(base)};\n`
	}

	for (const [selector, property] of Object.entries<undefined | Value>(rest)) {
		if (property === undefined) continue
		result += tab.repeat(indent) + `${selector} {\n`
		result += printProperty(propertyName, property, indent + 1)
		result += tab.repeat(indent) + `}\n`
	}

	return result
}
