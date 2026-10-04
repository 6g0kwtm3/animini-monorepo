import type { Locator, Page } from "@playwright/test"
import { expect } from "@playwright/test"
import { Nav } from "./Nav"

export class MediaPage {
	cover: Locator

	edit: Locator
	loginToEdit: Locator
	nav: Nav
	title: Locator
	private constructor(page: Page) {
		this.nav = new Nav(page)
		const main = page.getByRole("main")
		this.title = main.getByRole("heading")
		this.cover = main.locator("img")
		this.edit = main.getByRole("link", { name: "Edit", exact: true })
		this.loginToEdit = main.getByRole("link", {
			name: "Login to edit",
			exact: true,
		})
	}
	static async new(page: Page): Promise<MediaPage> {
		await expect(page).toHaveTitle(/Media - /)
		return new MediaPage(page)
	}
}
