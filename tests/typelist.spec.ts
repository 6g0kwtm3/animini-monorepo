import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";
import { FeedPage } from "./IndexPage";
import { Nav } from "./Nav";

test.use({ storageState: "playwright/.auth/user.json" })

class TypelistPage {
	nav: Nav
	private constructor(private page: Page) {
		this.nav = new Nav(page)
	}
	static async new(page: Page) {
		await expect(page).toHaveTitle(/(anime|manga) list/)
		return new TypelistPage(page)
	}
}

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
