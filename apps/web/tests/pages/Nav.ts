import type { Locator, Page } from "@playwright/test"
import { expect } from "@playwright/test"

export class LoginPage {
	token: Locator

	nav: Nav
	main: Locator
	login: Locator
	private constructor(page: Page) {
		this.nav = new Nav(page)
		this.main = page.getByRole("main")
		this.token = this.main.getByPlaceholder(" ")
		this.login = this.main.getByRole("button", { name: "Login" })
	}

	static async new(page: Page): Promise<LoginPage> {
		await expect(page).toHaveTitle("Login")
		return new LoginPage(page)
	}
}

export class Nav {
	login: Locator
	profile: Locator
	animeList: Locator
	mangaList: Locator
	feed: Locator
	explore: Locator
	notifications: Locator

	public async gotoLogin(): Promise<LoginPage> {
		await this.login.click()
		return LoginPage.new(this.page)
	}
	private page: Page

	constructor(page: Page) {
		this.page = page
		const nav = page.getByRole("navigation")
		this.login = nav.getByRole("link", { name: "Login" })
		this.profile = nav.getByRole("link", { name: "Profile" })
		this.animeList = nav.getByRole("link", { name: "Anime List" })
		this.mangaList = nav.getByRole("link", { name: "Manga List" })
		this.feed = nav.getByRole("link", { name: "Feed" })
		this.explore = nav.getByRole("link", { name: "Explore" })
		this.notifications = nav.getByRole("link", { name: "Notifications" })
	}
}
