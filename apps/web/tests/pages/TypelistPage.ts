import { expect, type Locator, type Page } from "@playwright/test"
import { Nav } from "./Nav"

export class TypelistPage {
	nav: Nav
	page: Page
	private constructor(page: Page) {
		this.nav = new Nav(page)
		this.page = page
	}
	static async new(page: Page): Promise<TypelistPage> {
		await expect(page).toHaveTitle(/(anime|manga) list/)
		return new TypelistPage(page)
	}

	public entry(mediaTitle: RegExp | string) {
		return new MediaListItem(
			this.page
				.getByTestId("media-list-item")
				.filter({ has: this.page.getByText(mediaTitle) })
		)
	}
}

class MediaListItem {
	public readonly privateBadge: Locator
	public readonly progress: Locator
	public readonly sync: Locator
	constructor(locator: Locator) {
		this.sync = locator.getByRole("button", { name: "Sync" })
		this.progress = locator.getByTestId("progress")
		this.privateBadge = locator.getByTestId("private-badge")
	}
}
