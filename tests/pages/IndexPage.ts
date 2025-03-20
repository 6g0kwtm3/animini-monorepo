import type { Page } from "@playwright/test"
import { expect } from "@playwright/test"
import { Nav } from "./Nav"

export class HomePage {
	nav: Nav
	private constructor(page: Page) {
		this.nav = new Nav(page)
	}

	static async new(page: Page): Promise<HomePage> {
		await expect(page).toHaveTitle("Home")
		return new this(page)
	}
}
