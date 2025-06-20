import { defineConfig, devices } from "@playwright/test"
import dotenv from "dotenv"
dotenv.config()

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
	testDir: "./tests",
	timeout: 60000,
	expect: { timeout: 10000 },
	/* Run tests in files in parallel */
	fullyParallel: true,
	/* Fail the build on CI if you accidentally left test.only in the source code. */
	forbidOnly: !!process.env.CI,
	/* Opt out of parallel tests on CI. */
	// workers: process.env.CI ? 1 : undefined,
	/* Reporter to use. See https://playwright.dev/docs/test-reporters */
	reporter: process.env.CI ? "github" : "dot",
	/* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
	use: {
		/* Base URL to use in actions like `await page.goto('/')`. */
		baseURL: process.env.BASE_URL ?? "http://localhost:3000",

		/* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
		trace: "on-first-retry",
	},

	/* Configure projects for major browsers */
	projects: [
		// { name: "setup", testMatch: /.*\.setup\.ts/ },

		// {
		//   name: 'chromium',
		//   use: { ...devices['Desktop Chrome'] },
		// },

		// {
		//   name: 'firefox',
		//   use: { ...devices['Desktop Firefox'] },
		// },

		// {
		//   name: 'webkit',
		//   use: { ...devices['Desktop Safari'] },
		// },

		/* Test against mobile viewports. */
		{
			name: "mobile-chrome",
			use: { ...devices["Pixel 5"] },
			// dependencies: ["setup"],
		},
		{
			name: "mobile-webkit",
			use: { ...devices["iPhone 12"] },
			// dependencies: ["setup"],
		},

		/* Test against branded browsers. */
		// {
		//   name: 'Microsoft Edge',
		//   use: { ...devices['Desktop Edge'], channel: 'msedge' },
		// },
		// {
		//   name: 'Google Chrome',
		//   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
		// },
	],

	/* Run your local dev server before starting the tests */
	webServer: {
		command: "pnpm exec turbo web#start",
		url: "http://localhost:3000",
		reuseExistingServer: !process.env.CI,
	},
})
