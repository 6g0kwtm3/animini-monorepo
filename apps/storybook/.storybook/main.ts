import type { StorybookConfig } from "@storybook/react-vite"
import { mergeConfig } from "vite"

import babel from "vite-plugin-babel"

const config = {
	typescript: { reactDocgen: "react-docgen-typescript" },
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
	viteFinal: (config) =>
		mergeConfig(config, { plugins: [babel({ filter: /\.[jt]sx?$/ })] }),
} satisfies StorybookConfig

export default config
