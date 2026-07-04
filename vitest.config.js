import { defineConfig } from "vite-plus"

export default defineConfig({
	test: {
		projects: ["apps/*", "packages/*"],
		globalSetup: "./vitest.setup.ts",
		mockReset: true,
	},
})
