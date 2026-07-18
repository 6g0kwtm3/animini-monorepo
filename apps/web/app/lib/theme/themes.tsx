import { argbFromHex } from "@material/material-color-utilities"
import { getThemeFromArgb } from "."

const blue = argbFromHex("#3db4f2")
const purple = argbFromHex("#c063ff")
const green = argbFromHex("#4cca51")
const orange = argbFromHex("#ef881a")
const red = argbFromHex("#e13333")
const pink = argbFromHex("#fc9dd6")
const gray = argbFromHex("#677b94")

export const themes = {
	blue: { theme: getThemeFromArgb(blue), argb: blue },
	purple: { theme: getThemeFromArgb(purple), argb: purple },
	green: { theme: getThemeFromArgb(green), argb: green },
	orange: { theme: getThemeFromArgb(orange), argb: orange },
	red: { theme: getThemeFromArgb(red), argb: red },
	pink: { theme: getThemeFromArgb(pink), argb: pink },
	gray: { theme: getThemeFromArgb(gray), argb: gray },
}
