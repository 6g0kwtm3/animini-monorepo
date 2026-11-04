import { expect } from "@playwright/test"

import { Nav } from "./Nav"

import type { Locator, Page } from "@playwright/test"

export class NotificationsPage {
	empty: Locator
	/** Every notification is a link to whatever it is about. */
	items: Locator
	/**
	 * Marking as read is an icon-only submit button whose label lives in a tooltip,
	 * so it is found as the only button the page offers.
	 */
	markAllAsRead: Locator
	nav: Nav

	private constructor(page: Page) {
		this.nav = new Nav(page)
		const main = page.getByRole("main")
		this.empty = main.getByRole("heading", { name: "No Notifications" })
		this.items = main.getByRole("list").getByRole("link")
		this.markAllAsRead = main.getByRole("button")
	}

	static async new(page: Page): Promise<NotificationsPage> {
		await expect(page).toHaveTitle("Notifications")
		return new NotificationsPage(page)
	}
}
