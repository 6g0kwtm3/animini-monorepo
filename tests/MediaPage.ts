import type { Locator, Page } from "@playwright/test"
import { expect } from "@playwright/test"
import { Nav } from "./Nav"

export class MediaPage {
	nav: Nav
	title: Locator

	private constructor(private page: Page) {
		this.nav = new Nav(page)
		const main = page.getByRole("main")
		this.title = main.getByRole("heading")
	}
	static async new(page: Page) {
		await expect(page).toHaveTitle(/Media - /)
		return new MediaPage(page)
	}
}
