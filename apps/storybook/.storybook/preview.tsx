import type { Preview } from "@storybook/react-vite"

import { useInsertionEffect } from "react"

import fallback from "design/theme.json"

import { utilities } from "design"

// import "./index.css"

const preview = {
	parameters: {
		controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
	},

	decorators: [
		(Story) => {
			useInsertionEffect(() => {
				Object.entries(fallback).forEach(([key, value]) => {
					document.documentElement.style.setProperty(key, value)
				})

				document.documentElement.style.setProperty(
					"font-optical-sizing",
					"auto"
				)

				document.documentElement.style.setProperty("color-scheme", "light")

				const nodes = document.querySelectorAll<HTMLElement>(".docs-story")

				;[document.documentElement, ...nodes].forEach((node) => {
					node.style.setProperty("background-color", `rgb(var(--surface))`)
					node.style.setProperty("color", `rgb(var(--on-surface))`)
				})

				// document.documentElement.className = ({
				// 	contrast: { base: "standard", _moreContrast: "high" },
				// 	theme: { base: "light", _dark: "dark" },
				// 	background: "surface",
				// })
			}, [])

			return (
				<>
					<Story></Story>

					<style>{`:root {\n${objectToCss(utilities.contrast("standard"))}${objectToCss(
						utilities.theme("light")
					)}}`}</style>
				</>
			)
		},
	],
} satisfies Preview

export default preview

function objectToCss(object: Record<string, string>) {
	return Object.entries(object)

		.map(([key, value]) => {
			return `${key}: ${value};\n`
		})

		.join("")
}
