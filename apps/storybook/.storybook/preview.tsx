import type { Preview } from "@storybook/react"
import { useInsertionEffect } from "react"
import fallback from "../../web/fallback.json"
import { css } from "../styled-system/css"
import "./index.css"

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
				document.documentElement.className = css({
					contrast: { base: "standard", _moreContrast: "high" },
					theme: { base: "light", _dark: "dark" },
					background: "surface",
				})
			}, [])
			return <Story></Story>
		},
	],
} satisfies Preview

export default preview
