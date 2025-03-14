import { DecoratorHelpers } from "@storybook/addon-themes"
import { type Decorator, type Preview } from "@storybook/react"
import React from "react"
import { useEffect } from "storybook/internal/preview-api"

import "./tailwind.css"
const { initializeThemeState, pluckThemeFromContext, useThemeParameters } =
	DecoratorHelpers

import { fallback as theme } from "m3-core"

declare module "@storybook/react" {
	interface Parameters {
		dir?: "rtl" | "ltr"
		contrastMore?: "true"
	}
}

function withTheme<K extends string>({
	themes,
	defaultTheme,
}: {
	defaultTheme: NoInfer<K>
	themes: Record<K, Record<string, string>>
}): Decorator {
	initializeThemeState(Object.keys(themes), defaultTheme)

	return (Story, context) => {
		const selectedTheme = pluckThemeFromContext(context)
		const { themeOverride } = useThemeParameters()

		const selected = themeOverride || selectedTheme || defaultTheme

		const theme2 = themes[selected]

		useEffect(() => {
			for (const [key, value] of Object.entries(theme2)) {
				document.documentElement.setAttribute(key, String(value))
			}
		}, [theme2])

		useEffect(() => {
			document.documentElement.dataset.contrast =
				context.parameters.contrastMore
		}, [context.parameters.contrastMore])

		useEffect(() => {
			document.documentElement.dir = context.parameters.dir ?? "ltr"
		}, [context.parameters.dir])

		return <Story />
	}
}

const style = Object.entries(theme)
	.map(([key, value]) => `${key}: ${value}`)
	.join(";")

import { SnackbarQueue } from "../app/components/Snackbar"
import RelayEnvironment from "../app/lib/Network/components"
import { Ariakit } from "../app/lib/ariakit"

const withProviders: Decorator = (Story) => {
	return (
		<RelayEnvironment>
			<SnackbarQueue>
				<Ariakit.HeadingLevel>
					<Story></Story>
				</Ariakit.HeadingLevel>
			</SnackbarQueue>
		</RelayEnvironment>
	)
}

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
	},

	decorators: [
		withProviders,
		withTheme({
			defaultTheme: "light",
			themes: {
				light: {
					style: style,
					class:
						"bg-surface font-['Noto_Sans',sans-serif] contrast-standard theme-light scheme-light data-[contrast='true']:contrast-high",
				},
				dark: {
					style: style,
					class:
						"bg-surface font-['Noto_Sans',sans-serif] contrast-standard theme-dark scheme-dark data-[contrast='true']:contrast-high",
				},
			},
		}),
	],
}

export default preview
