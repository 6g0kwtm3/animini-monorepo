import { DecoratorHelpers } from "@storybook/addon-themes"
import { type Decorator, type Preview } from "@storybook/react"
import { useEffect } from "storybook/internal/preview-api"

import { route } from "@react-router/dev/routes"
import { createRoutesStub as createRemixStub } from "react-router"

import "./tailwind.css"
const { initializeThemeState, pluckThemeFromContext, useThemeParameters } =
	DecoratorHelpers

import theme from "~/../fallback.json"

declare module "@storybook/react" {
	interface Parameters {
		dir?: "rtl" | "ltr"
		contrastMore?: true
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
				document.documentElement.setAttribute(key, value)
			}
		}, [theme2])

		useEffect(() => {
			document.documentElement.dataset.contrast =
				context.parameters.contrastMore
		}, [context.parameters.contrastMore])

		useEffect(() => {
			document.documentElement.dir = context.parameters.dir
		}, [context.parameters.dir])

		return <Story />
	}
}

interface RouterProps extends RemixStubProps {
	routes: (
		Story: Parameters<Decorator>[0]
	) => Parameters<typeof createRemixStub>[0]
}

declare module "@storybook/react" {
	interface Parameters {
		router?: RouterProps
	}
}

const withRouter: Decorator = (Story, context) => {
	const { routes, ...props } = context.parameters.router || {}

	const RemixStub = createRemixStub(
		typeof routes === "function"
			? routes(Story)
			: [
					route("*", {
						Component: Story,
					}),
				]
	)

	return (
		<RemixStub
			{...props}
			future={{
				unstable_singleFetch: true,
				v3_relativeSplatPath: true,
				v3_fetcherPersist: true,
				...props?.future,
			}}
		/>
	)
}

const style = Object.entries(theme)
	.map(([key, value]) => `${key}: ${value}`)
	.join(";")

import { graphql, http, HttpResponse, passthrough } from "msw"

import { mock } from "~/mocks/handlers"

import { initialize, mswLoader } from "msw-storybook-addon"
initialize({}, [
	graphql.operation(mock()),
	http.post("https://graphql.anilist.co/", () => HttpResponse.error()),
	http.get("*", () => passthrough()),
])

import { SnackbarQueue } from "~/components/Snackbar"
import environment from "~/lib/Network"
import { RelayEnvironmentProvider as RelayEnvironmentProvider_ } from "~/lib/Network/components"
import { Ariakit } from "~/lib/ariakit"

const withProviders: Decorator = (Story, context) => {
	return (
		<RelayEnvironmentProvider_ environment={environment}>
			<SnackbarQueue>
				<Ariakit.HeadingLevel>
					<Story></Story>
				</Ariakit.HeadingLevel>
			</SnackbarQueue>
		</RelayEnvironmentProvider_>
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
	loaders: [mswLoader],
	decorators: [
		withRouter,
		withProviders,
		withTheme({
			defaultTheme: "light",
			themes: {
				light: {
					style: style,
					class:
						"bg-surface font-['Noto_Sans',sans-serif] contrast-standard theme-light [color-scheme:light] data-[contrast='true']:contrast-high",
				},
				dark: {
					style: style,
					class:
						"bg-surface font-['Noto_Sans',sans-serif] contrast-standard theme-dark [color-scheme:dark] data-[contrast='true']:contrast-high",
				},
			},
		}),
	],
}

export default preview
