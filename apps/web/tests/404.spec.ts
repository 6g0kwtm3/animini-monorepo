import { expect } from "@playwright/test"
import { test } from "./fixtures"

test("showing not found", async ({ goto, newPage }) => {
	await using page = await newPage()
	await goto(page, "/foo/bar/baz")

	await expect(page.getByText("Not found")).toBeVisible()
})
