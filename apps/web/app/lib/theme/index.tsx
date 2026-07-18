import {
	argbFromHex,
	blueFromArgb,
	DynamicColor,
	greenFromArgb,
	Hct,
	MaterialDynamicColors,
	redFromArgb,
	SchemeTonalSpot,
} from "@material/material-color-utilities"
import type { CSSProperties } from "react"

import colors from "@anitrove/design/colors"
import { precompileStyles, type OutStyles } from "@anitrove/unstyled"

export type Theme = OutStyles

const {
	contentAccentToneDelta: _contentAccentToneDelta,
	prototype: _prototype,
	...rest
} = MaterialDynamicColors

const dynamicColors: Record<string, DynamicColor> = rest

export function getThemeFromHex(hex: string): Theme {
	const main = Hct.fromInt(argbFromHex(hex))

	return precompileStyles(
		Object.fromEntries(
			(
				[
					["standard", 0],
					["high", 0.35],
				] as const
			).flatMap(([contrast, contrastLevel]): readonly [string, string][] => {
				return (
					[
						["light", false],
						["dark", true],
					] as const
				).flatMap(([theme, isDark]): readonly [string, string][] => {
					const spot = new SchemeTonalSpot(main, isDark, contrastLevel)

					return Object.keys(colors.light).map((key): [string, string] => {
						const color = key.replaceAll(/-([a-z])/g, (_, l: string) =>
							l.toUpperCase()
						)

						const dynamicColor = dynamicColors[color]
						if (!dynamicColor) {
							throw new Error(`Unknown color ${color}`)
						}

						return [
							`--${key}-${theme}-${contrast}`,
							formatArgb(dynamicColor.getArgb(spot)),
						]
					})
				})
			})
		) satisfies CSSProperties
	)

	// return light
}

function formatArgb(argb: number): string {
	return [redFromArgb(argb), greenFromArgb(argb), blueFromArgb(argb)].join(" ")
}
