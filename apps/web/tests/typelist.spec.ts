import { type BrowserContext, type Locator, type Page } from "@playwright/test"
import { graphql, HttpResponse } from "msw"

import { type } from "arktype"
import routeNavUserQueryRequest, {
	type routeNavUserQuery$rawResponse,
	type routeNavUserQuery$variables,
} from "~/gql/routeNavUserQuery.graphql"
import { invariant } from "~/lib/invariant"
import { Token } from "~/lib/viewer"
import { SuccessHandler, test } from "./fixtures"
import { FeedPage } from "./pages/IndexPage"
import { TypelistPage } from "./pages/TypelistPage"

class UserPage {
	animeList: Locator
	mangaList: Locator
	static new(page: Page) {
		return new UserPage(page)
	}
	private constructor(private page: Page) {
		this.animeList = page
			.getByRole("main")
			.getByRole("tab", { name: "Anime list" })
		this.mangaList = page
			.getByRole("main")
			.getByRole("tab", { name: "Manga list" })
	}
}

const Viewer = { id: 1, name: "User" }
const handlers = [
	graphql.query<routeNavUserQuery$rawResponse, routeNavUserQuery$variables>(
		routeNavUserQueryRequest.fragment.name,
		() =>
			HttpResponse.json({
				data: {
					Viewer: Viewer,
					user: {
						id: 1,
						name: "User",
						avatar: null,
						bannerImage: null,
						isFollowing: null,
						options: null,
					},
				},
			})
	),
	SuccessHandler,
]

const cookies = [
	{
		name: `anilist-token`,
		value: invariant(
			type("object.json.stringify")(
				invariant(Token({ token: "", viewer: Viewer }))
			)
		),
		sameSite: "Lax",
		expires: Date.now() / 1000 + 8 * 7 * 24 * 60 * 60, // 8 weeks
		path: "/",
		domain: "localhost",
	},
] satisfies Parameters<BrowserContext["addCookies"]>[0]

test.fixme(true, "fix main page")

test.beforeEach(async ({ worker, context }) => {
	worker.use(...handlers)
	await context.addCookies(cookies)
})

test.describe("fullscreen", () => {
	test("anime list", async ({ page, isMobile }) => {
		test.skip(isMobile)

		await page.goto("/")
		await page.keyboard.press("Control+.")
		const indexPage = await FeedPage.new(page)
		// when
		await indexPage.nav.animeList.click()
		// then
		await TypelistPage.new(page)
	})

	test("manga list", async ({ page, isMobile }) => {
		test.skip(isMobile)
		await page.goto("/")
		await page.keyboard.press("Control+.")
		const indexPage = await FeedPage.new(page)
		// when
		await indexPage.nav.profile.click()
		// then
		await TypelistPage.new(page)
	})
})

test("anime list", async ({ page }) => {
	await page.goto("/")
	await page.keyboard.press("Control+.")
	const indexPage = await FeedPage.new(page)
	await indexPage.nav.profile.click()
	const userpage = UserPage.new(page)
	// when
	await userpage.animeList.click()
	// then
	await TypelistPage.new(page)
})

test("manga list", async ({ page }) => {
	await page.goto("/")
	await page.keyboard.press("Control+.")
	const indexPage = await FeedPage.new(page)
	await indexPage.nav.profile.click()
	const userpage = UserPage.new(page)
	// when
	await userpage.mangaList.click()
	// then
	await TypelistPage.new(page)
})
