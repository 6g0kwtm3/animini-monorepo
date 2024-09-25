import { storybookTest } from "@storybook/experimental-addon-test/vitest-plugin"
import { defineConfig, mergeConfig } from "vitest/config"

import viteConfig from "./vite.config"

export default mergeConfig(
	viteConfig,
	defineConfig({
		plugins: [
			storybookTest({
				storybookScript: "bun run dev:storybook",
			}),
		],
		test: {
			include: ["**/*.stories.?(m)[jt]s?(x)"],
			exclude: ["**/node_modules/**", "**/tests/**"],
			browser: {
				enabled: true,
				name: "chromium",
				// Make sure to install Playwright
				provider: "playwright",
				headless: true,
			},
			isolate: false,
			setupFiles: ["./.storybook/vitest.setup.ts"],
		},
	})
)
