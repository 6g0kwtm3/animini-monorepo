import { test } from "@playwright/test"

test("login", async ({ page }) => {
	await page.goto("/")
	await page.keyboard.press("Control+.")
	await page.getByRole("link", { name: "Login" }).click()
	await page.getByPlaceholder(" ").fill(process.env.ANILIST_TEST_TOKEN!)
	await page.getByRole("button", { name: "Login" }).click()
	await page.getByRole("link", { name: "Profile" }).click()
})
