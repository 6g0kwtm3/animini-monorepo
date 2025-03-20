import {
	argbFromHex,
	blueFromArgb,
	greenFromArgb,
	Hct,
	MaterialDynamicColors,
	redFromArgb,
	SchemeTonalSpot,
} from "@material/material-color-utilities"
import type { CSSProperties } from "react"

import colors from "~/../colors.json"

export type Theme = {
	[k: string]: string
}

export function getThemeFromHex(hex: string): Theme {
	const main = Hct.fromInt(argbFromHex(hex))

	return Object.fromEntries(
		Object.keys(colors.light).flatMap((key) => {
			const color = key.replaceAll(/-([a-z])/g, (_, l) => l.toUpperCase())

			if (!(color in MaterialDynamicColors)) {
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
						// @ts-expect-error this is fine
						formatArgb(MaterialDynamicColors[color]?.getArgb?.(spot)),
					]
				})
			})
		})
	) satisfies CSSProperties

	// return light
}

function formatArgb(argb: number): string {
	return [redFromArgb(argb), greenFromArgb(argb), blueFromArgb(argb)].join(" ")
}
