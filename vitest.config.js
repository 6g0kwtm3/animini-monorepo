import { defineConfig } from "vitest/config"

export default defineConfig({
	test: {
		projects: ["apps/*", "packages/*", "apps/web/vitest.browser.config.ts"],
		globalSetup: "./vitest.setup.ts",
		mockReset: true,
	},
})
