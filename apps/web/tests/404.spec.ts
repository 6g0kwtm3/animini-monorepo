import { expect } from "@playwright/test"
import { test } from "./fixtures"

test("showing not found", async ({ page, worker }) => {
	await page.goto("/foo/bar/baz")

	await expect(page.getByText("Not found")).toBeVisible()
	await expect(page).toHaveScreenshot()
})
