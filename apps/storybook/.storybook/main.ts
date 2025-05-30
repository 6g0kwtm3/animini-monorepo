import type { StorybookConfig } from "@storybook/react-vite"
import { createRequire } from "node:module"
import { dirname, join } from "node:path"
import { mergeConfig } from "vite"

const require = createRequire(import.meta.url)

import babel from "vite-plugin-babel"

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
	viteFinal: (config) =>
		mergeConfig(config, { plugins: [babel({ filter: /\.[jt]sx?$/ })] }),
} satisfies StorybookConfig

export default config

function getAbsolutePath(value: string): string {
	return dirname(require.resolve(join(value, "package.json")))
}
