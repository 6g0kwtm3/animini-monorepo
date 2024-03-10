import {
	argbFromHex,
	themeFromSourceColor,
	type Theme
} from "@material/material-color-utilities"
import { useMemo } from "react"
export function getThemeFromHex(hex: string): Theme {
	const theme = themeFromSourceColor(argbFromHex(hex))

	return theme
}

export function useThemeFromHex(
	hex: string | null | undefined
): Theme | null | undefined {
	return useMemo(
		() => (typeof hex === "string" ? getThemeFromHex(hex) : hex),
		[hex]
	)
}
