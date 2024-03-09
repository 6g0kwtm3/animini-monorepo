import { expect, test } from "@playwright/test"
import { MediaPage } from "./MediaPage"
import { SearchPage } from "./SearchPage"

test("search with keyboard", async ({ page }) => {
	await page.goto("/")
	await page.keyboard.press("Control+.")
	await page.keyboard.press("Control+k")
	const searchPage = SearchPage.new(page)
	await searchPage.search.fill("sousou no frieren")
	await expect(searchPage.active).toHaveText(/Sousou no Frieren/)
	await searchPage.search.press("ArrowDown")
	await expect(await searchPage.active.textContent()).toBe(
		await searchPage.options.nth(1).textContent()
	)
	await searchPage.search.press("Enter")
	const mediaPage = await MediaPage.new(page)
	await expect(mediaPage.title).toHaveText("Sousou no Frieren")
})

test("search", async ({ page }) => {
	await page.goto("/")
	await page.keyboard.press("Control+.")
	await page.keyboard.press("Control+k")
	const searchPage = SearchPage.new(page)
	await searchPage.search.fill("sousou no frieren")
	await expect(searchPage.active).toHaveText(/Sousou no Frieren/)
	await searchPage.search.press("Enter")
	const mediaPage = await MediaPage.new(page)
	await expect(mediaPage.title).toHaveText("Sousou no Frieren")
})
