import { playwright } from "@vitest/browser-playwright"
import { defineProject, type UserWorkspaceConfig } from "vitest/config"

const config: UserWorkspaceConfig = defineProject({
	root: import.meta.dirname,
	optimizeDeps: {
		include: [
			"react",
			"react/jsx-runtime",
			"react-dom",
			"react-dom/client",
			"vitest/browser",
		],
	},
	test: {
		name: "web-browser",
		include: ["app/**/*.browser.test.{ts,tsx}"],
		browser: {
			enabled: true,
			headless: true,
			provider: playwright(),
			instances: [{ browser: "chromium" }],
			viewport: { width: 1024, height: 768 },
		},
	},
})
export default config