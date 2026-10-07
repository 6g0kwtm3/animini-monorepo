import { expect } from "@playwright/test"

import { Nav } from "./Nav"

import type { Page } from "@playwright/test"

export class FeedPage {
	nav: Nav
	private constructor(page: Page) {
		this.nav = new Nav(page)
	}

	static async new(page: Page): Promise<FeedPage> {
		await expect(page).toHaveTitle("Feed")
		return new this(page)
	}
}
