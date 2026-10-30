import { createRequire } from "node:module"
import { dirname, join } from "node:path"
import icons from "unplugin-icons/vite"

import type { StorybookConfig } from "@storybook/react-vite"

const require = createRequire(import.meta.url)

const config = {
	typescript: { reactDocgen: "react-docgen-typescript" },
	stories: [
		"../stories/**/*.mdx",
		"../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)",
	],
	addons: [
		getAbsolutePath("@storybook/addon-docs"),
		getAbsolutePath("@storybook/addon-onboarding"),
		getAbsolutePath("@chromatic-com/storybook"),
		getAbsolutePath("@storybook/addon-a11y"),
		getAbsolutePath("@storybook/addon-themes"),
		getAbsolutePath("@storybook/addon-vitest"),
	],
	framework: { name: getAbsolutePath("@storybook/react-vite"), options: {} },
	viteFinal: (config) => {
		config.plugins = [
			...(config.plugins ?? []),
			icons({
				compiler: "jsx",
				jsx: "react",
				iconCustomizer(_collection, _icon, props) {
					props.width = "1em"
					props.height = "1em"
				},
			}),
		]
		return config
	},
} satisfies StorybookConfig

export default config

function getAbsolutePath(value: string): string {
	return dirname(require.resolve(join(value, "package.json")))
}
