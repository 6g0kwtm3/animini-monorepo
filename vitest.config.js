import { defineConfig } from "vitest/config"

export default defineConfig({
	test: {
		projects: ["apps/*", "packages/*"],
		globalSetup: "./vitest.setup.ts",
	},
})
