import {
	argbFromHex,
	blueFromArgb,
	greenFromArgb,
	Hct,
	MaterialDynamicColors,
	redFromArgb,
	SchemeTonalSpot
} from "@material/material-color-utilities"
import type { CSSProperties } from "react"

import colors from "~/../colors.json"

export function getThemeFromHex(hex: string): CSSProperties {
	const main = Hct.fromInt(argbFromHex(hex))

	const contrast = 0.35

	const light = new SchemeTonalSpot(main, false, contrast)
	const dark = new SchemeTonalSpot(main, true, contrast)

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
					["high", 0.35]
				] as const
			).flatMap(([contrast, contrastLevel]) => {
				return (
					[
						["light", false],
						["dark", true]
					] as const
				).map(([theme, isDark]) => {
					const spot = new SchemeTonalSpot(main, isDark, contrastLevel)

					return [
						`--${key}-${theme}-${contrast}`,
						// @ts-ignore
						formatArgb(MaterialDynamicColors[color]?.getArgb?.(spot))
					]
				})
			})
		})
	)

	// return light
}

function formatArgb(argb: number): string {
	return [redFromArgb(argb), greenFromArgb(argb), blueFromArgb(argb)].join(" ")
}
