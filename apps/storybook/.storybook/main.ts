import type { StorybookConfig } from "@storybook/react-vite"

const config = {
	stories: [
		"../stories/**/*.mdx",
		"../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
	],
	addons: [
		"@storybook/addon-onboarding",
		{ name: "@storybook/addon-essentials", options: { backgrounds: false } },
		"@chromatic-com/storybook",
		"@storybook/addon-a11y",
		"@storybook/addon-themes",
		"@storybook/experimental-addon-test",
	],
	framework: { name: "@storybook/react-vite", options: {} },
} satisfies StorybookConfig

export default config
