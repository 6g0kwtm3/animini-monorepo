import { createRequire } from "node:module"
import { dirname, join } from "node:path"
import type { StorybookConfig } from "@storybook/react-vite"

const require = createRequire(import.meta.url)

const config = {
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
} satisfies StorybookConfig

export default config

function getAbsolutePath(value: string): any {
	return dirname(require.resolve(join(value, "package.json")))
}
