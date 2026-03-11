import { expect, type Page } from "@playwright/test"
import { Nav } from "./Nav"

export class TypelistPage {
	nav: Nav
	private constructor(private readonly page: Page) {
		this.nav = new Nav(page)
	}
	static async new(page: Page): Promise<TypelistPage> {
		await expect(page).toHaveTitle(/(anime|manga) list/)
		return new TypelistPage(page)
	}
}
