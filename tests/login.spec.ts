import { test } from "@playwright/test"
import { FeedPage } from "./IndexPage"

test.use({ storageState: "playwright/.auth/user.json" })

test("login", async ({ page }) => {
	await page.goto("/")
	await page.keyboard.press("Control+.")
	let indexPage = await FeedPage.new(page)
	await indexPage.nav.profile.click()
})
