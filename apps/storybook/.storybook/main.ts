import tailwindcss from "@tailwindcss/vite"
import type { StorybookConfig } from "@storybook/react-vite"
import { createRequire } from "node:module"
import { dirname, join } from "node:path"
import icons from "unplugin-icons/vite"
import macros from "unplugin-macros/vite"
import { mergeConfig } from "vite"

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

	/* The components under test are styled with Tailwind, resolve icons through `~icons`
	   and read their styles through `unplugin-macros`, so all three have to be registered
	   in Storybook's Vite pipeline too. */
	viteFinal(config) {
		return mergeConfig(config, {
			plugins: [
				macros(),
				tailwindcss(),
				icons({
					compiler: "jsx",
					jsx: "react",
					iconCustomizer(_collection, _icon, props) {
						props.width = "1em"
						props.height = "1em"
					},
				}),
			],
		})
	},
} satisfies StorybookConfig

export default config

function getAbsolutePath(value: string): string {
	return dirname(require.resolve(join(value, "package.json")))
}
