import { defineConfig } from "vitest/config"
import codspeedPlugin from "@codspeed/vitest-plugin"

export default defineConfig({
	test: {
		projects: ["apps/storybook", "packages/*"],
		globalSetup: "./vitest.setup.ts",
	},
	plugins: [codspeedPlugin()],
})
