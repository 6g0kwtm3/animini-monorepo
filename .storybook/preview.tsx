import type { Decorator, Preview } from "@storybook/react"

import { createRemixStub } from "@remix-run/testing"
import theme from "~/../fallback.json"
import "./tailwind.css"

const withTheme: Decorator = (Story, context) => {
	const parameters = context.parameters

	return (
		<div
			dir={context.parameters.dir}
			data-contrast-more={parameters.contrastMore}
			data-dark={parameters.dark}
			style={theme}
			className="font-['Noto_Sans',sans-serif] contrast-standard theme-light [color-scheme:light_dark] data-[contrast-more]:contrast-high data-[dark]:theme-dark"
		>
			<Story />
		</div>
	)
}

const withRouter: Decorator = (Story, context) => {
	const RemixStub = createRemixStub([
		{
			path: "*",
			Component: Story,
		},
	])
	return (
		<RemixStub
			future={{
				unstable_singleFetch: true,
				v3_relativeSplatPath: true,
				v3_fetcherPersist: true,
			}}
		/>
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
	decorators: [withTheme],
}

export default preview
