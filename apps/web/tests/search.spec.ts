import { expect, test } from "@playwright/test"
import { MediaPage } from "./pages/MediaPage"
import { SearchPage } from "./pages/SearchPage"

test("when search, ArrowDown should change focus", async ({ page }) => {
	await page.goto("/")
	await page.keyboard.press("Control+.")
	await expect(page.getByTestId("hydrated")).toBeVisible()
	await page.keyboard.press("Control+k")
	const searchPage = SearchPage.new(page)
	await searchPage.search.fill("sousou no frieren")
	await expect(searchPage.active).toHaveText(/Sousou no Frieren/)
	// when
	await searchPage.search.press("ArrowDown")
	// then
	expect(await searchPage.active.textContent()).toBe(
		await searchPage.options.nth(1).textContent()
	)
})

test("search", async ({ page }) => {
	await page.goto("/")
	await page.keyboard.press("Control+.")
	await expect(page.getByTestId("hydrated")).toBeVisible()
	await page.keyboard.press("Control+k")
	const searchPage = SearchPage.new(page)
	await searchPage.search.fill("sousou no frieren")
	await expect(searchPage.active).toHaveText(/Sousou no Frieren/)
	// when
	await searchPage.search.press("Enter")
	// then
	const mediaPage = await MediaPage.new(page)
	await expect(mediaPage.title).toHaveText("Sousou no Frieren")
})
