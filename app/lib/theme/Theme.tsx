import type { Theme } from "@material/material-color-utilities";
import { hexFromArgb } from "@material/material-color-utilities";
import type { ComponentPropsWithoutRef } from "react";
import { useId } from "react";
import colors from '../../../colors.json';
import { cssEscape } from "../cssEscape";

function getStyleFromTheme(theme: Theme | undefined | null, dark: boolean) {
	if (!theme) return {}

	const mapping = dark ? colors.dark : colors.light

	return Object.fromEntries(
		Object.entries(mapping).map(([key, value]) => {
			const [token = "", tone] = value.replaceAll(/(\d+)$/g, "_$1").split("_")

			const palette = (
				{
					primary: "primary",
					secondary: "secondary",
					tertiary: "tertiary",
					neutral: "neutral",
					"neutral-variant": "neutralVariant",
					error: "error"
				} as const
			)[token]
			if (!palette) {
				return []
			}
			return [`--${key}`, parseArgb(theme.palettes[palette].tone(Number(tone)))]
		})
	)
}



function parseArgb(value: number) {
	const [, r1 = "", r2 = "", g1 = "", g2 = "", b1 = "", b2 = ""] =
		hexFromArgb(value)
	const color = [
		Number.parseInt(r1 + r2, 16),
		Number.parseInt(g1 + g2, 16),
		Number.parseInt(b1 + b2, 16)
	].join(" ")

	return color
}
export const ThemeProvider = ({
	theme,
	children,
	...props
}: ComponentPropsWithoutRef<"div"> & {
	theme: Theme | undefined | null
}) => {
	const rawId = useId()

	const id = `#${cssEscape(rawId)}`

	return (
		<div {...props} id={rawId}>
			<style>
				{`${id}, ${id} ::backdrop{${Object.entries(
					getStyleFromTheme(theme, false)
				)
					.map(([key, value]) => `${key}:${value};`)
					.join(
						""
					)}} @media(prefers-color-scheme: dark){${id}, ${id} ::backdrop{${Object.entries(
					getStyleFromTheme(theme, true)
				)
					.map(([key, value]) => `${key}:${value};`)
					.join("")}}}`}
			</style>

			{children}
		</div>
	)
}