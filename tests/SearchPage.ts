import type { Locator, Page } from "@playwright/test"

export class SearchPage {
	dialog: Locator
	search: Locator
	active: Locator
	options: Locator
	static new(page: Page): SearchPage {
		return new SearchPage(page)
	}

	private constructor(private page: Page) {
		this.dialog = page.getByRole("dialog")
		this.options = this.dialog.getByRole("option")
		this.active = this.options.and(
			this.dialog.locator("[data-active-item='true']")
		)

		this.search = this.dialog
			.getByRole("search")
			.getByPlaceholder("Search anime or manga")
	}
}
