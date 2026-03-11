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
import { precompileStyles, type PreCompiledStyles } from "@anitrove/unstyled"

export type Theme = PreCompiledStyles

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
			Object.keys(colors.light).flatMap((key) => {
				const color = key.replaceAll(/-([a-z])/g, (_, l: string) =>
					l.toUpperCase()
				)

				const dynamicColor = dynamicColors[color]
				if (dynamicColor === undefined) {
					console.warn(`Unknown color ${color}`)
					return []
				}

				return (
					[
						["standard", 0],
						["high", 0.35],
					] as const
				).flatMap(([contrast, contrastLevel]) => {
					return (
						[
							["light", false],
							["dark", true],
						] as const
					).map(([theme, isDark]) => {
						const spot = new SchemeTonalSpot(main, isDark, contrastLevel)

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
