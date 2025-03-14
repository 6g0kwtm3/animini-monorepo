import { test, type Locator, type Page } from "@playwright/test"
import { FeedPage } from "./pages/IndexPage"
import { TypelistPage } from "./pages/TypelistPage"

test.use({ storageState: "playwright/.auth/user.json" })

class UserPage {
	animeList: Locator
	mangaList: Locator
	static new(page: Page) {
		return new UserPage(page)
	}
	private constructor(private page: Page) {
		this.animeList = page
			.getByRole("main")
			.getByRole("link", { name: "Anime list" })
		this.mangaList = page
			.getByRole("main")
			.getByRole("link", { name: "Manga list" })
	}
}

test.describe("fullscreen", () => {
	test("anime list", async ({ page, isMobile }) => {
		test.skip(isMobile)
		await page.goto("/")
		await page.keyboard.press("Control+.")
		const indexPage = await FeedPage.new(page)
		// when
		await indexPage.nav.animeList.click()
		// then
		await TypelistPage.new(page)
	})

	test("manga list", async ({ page, isMobile }) => {
		test.skip(isMobile)
		await page.goto("/")
		await page.keyboard.press("Control+.")
		const indexPage = await FeedPage.new(page)
		// when
		await indexPage.nav.profile.click()
		// then
		await TypelistPage.new(page)
	})
})

test("anime list", async ({ page }) => {
	await page.goto("/")
	await page.keyboard.press("Control+.")
	const indexPage = await FeedPage.new(page)
	await indexPage.nav.profile.click()
	const userpage = UserPage.new(page)
	// when
	await userpage.animeList.click()
	// then
	await TypelistPage.new(page)
})

test("manga list", async ({ page }) => {
	await page.goto("/")
	await page.keyboard.press("Control+.")
	const indexPage = await FeedPage.new(page)
	await indexPage.nav.profile.click()
	const userpage = UserPage.new(page)
	// when
	await userpage.mangaList.click()
	// then
	await TypelistPage.new(page)
})
