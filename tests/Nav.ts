import type { Locator, Page } from "@playwright/test";
import { LoginPage } from "./LoginPage";


export class Nav {
  login: Locator;
  profile: Locator;
  animeList: Locator;
  mangaList: Locator;
  feed: Locator;
  explore: Locator;
  notifications: Locator;

  public async gotoLogin() {
    await this.login.click();
    return LoginPage.new(this.page);
  }
  private page: Page;

  constructor(page: Page) {
    this.page = page;
    const nav = page.getByRole("navigation");
    this.login = nav.getByRole("link", { name: "Login" });
    this.profile = nav.getByRole("link", { name: "Profile" });
    this.animeList = nav.getByRole("link", { name: "AnimeList" });
    this.mangaList = nav.getByRole("link", { name: "MangaList" });
    this.feed = nav.getByRole("link", { name: "Feed" });
    this.explore = nav.getByRole("link", { name: "Explore" });
    this.notifications = nav.getByRole("link", { name: "Notifications" });
  }
}
