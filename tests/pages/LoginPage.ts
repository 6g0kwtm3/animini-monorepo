import type { Locator, Page } from "@playwright/test"
import { expect } from "@playwright/test"
import { Nav } from "./Nav"

export class LoginPage {
	token: Locator

	nav: Nav
	main: Locator
	login: Locator
	private constructor(private page: Page) {
		this.nav = new Nav(page)
		this.main = page.getByRole("main")
		this.token = this.main.getByPlaceholder(" ")
		this.login = this.main.getByRole("button", { name: "Login" })
	}

	static async new(page: Page): Promise<LoginPage> {
		// await expect(page).toHaveTitle("Login")
		return new LoginPage(page)
	}
}
