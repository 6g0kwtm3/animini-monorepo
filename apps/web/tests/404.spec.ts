import { expect } from "@playwright/test"
import { test } from "./fixtures"

test("showing not found", async ({ newPage, isElectron }) => {
	test.skip(isElectron, "Electron doesn't support goto")
	await using page = await newPage()
	await page.goto("/foo/bar/baz")

	await expect(page.getByText("Not found")).toBeVisible()
})
