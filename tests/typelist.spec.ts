import { test } from "@playwright/test";
import { FeedPage } from "./IndexPage";
import { TypelistPage } from "./TypelistPage";

test.use({ storageState: "playwright/.auth/user.json" })

test("anime list", async ({ page }) => {
	await page.goto("/")
	await page.keyboard.press("Control+.")
	let indexPage = await FeedPage.new(page)
	// when
	await indexPage.nav.animeList.click()
	// then
})

test("manga list", async ({ page }) => {
	await page.goto("/")
	await page.keyboard.press("Control+.")
	let indexPage = await FeedPage.new(page)
	// when
	await indexPage.nav.mangaList.click()
	// then
	await TypelistPage.new(page)
})
