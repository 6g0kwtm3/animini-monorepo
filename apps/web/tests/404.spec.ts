import { expect } from "@playwright/test"
import { test } from "./fixtures"

test("showing not found", async ({ page, worker, isElectron: electron }) => {
	test.skip(electron, "Electron doesn't support goto")

	await page.goto("/foo/bar/baz")

	await expect(page.getByText("Not found")).toBeVisible()
})
