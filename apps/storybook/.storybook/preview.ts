import type { Preview } from "@storybook/react-vite"

const preview = {
	parameters: {
		controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
	},
} satisfies Preview

export default preview
