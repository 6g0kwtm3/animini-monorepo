import { argbFromHex, themeFromSourceColor } from "@material/material-color-utilities";
import { useMemo } from "react";
export function getThemeFromHex(hex: string) {
	const theme = themeFromSourceColor(argbFromHex(hex))

	return theme
}

export function useThemeFromHex(hex: string | null | undefined) {
	return useMemo(
		() => (typeof hex === "string" ? getThemeFromHex(hex) : hex),
		[hex]
	)
}
