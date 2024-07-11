import type { Decorator, Preview } from "@storybook/react"

import "~/tailwind.css"
import theme from "~/../fallback.json"

const withTheme: Decorator = (Story, context) => {
	const parameters = context.parameters

	console.log(context)
	return (
		<div
			dir={context.parameters.dir}
			data-contrast-more={parameters.contrastMore}
			style={theme}
			className="font-['Noto_Sans',sans-serif] contrast-standard theme-light [color-scheme:light_dark] data-[contrast-more]:contrast-high data-[dark]:theme-dark"
		>
			<Story />
		</div>
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
