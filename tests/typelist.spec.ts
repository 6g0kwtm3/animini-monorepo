import { type Locator, type Page } from "@playwright/test"
import { graphql, HttpResponse } from "msw"
import type {
	rootQuery$rawResponse,
	rootQuery$variables,
} from "~/gql/rootQuery.graphql"
import type {
	routeNavUserIndexQuery$rawResponse,
	routeNavUserIndexQuery$variables,
} from "~/gql/routeNavUserIndexQuery.graphql"
import type {
	routeNavUserQuery$rawResponse,
	routeNavUserQuery$variables,
} from "~/gql/routeNavUserQuery.graphql"
import { SucccessHandler, test } from "./fixtures"
import { HomePage } from "./pages/IndexPage"
import { TypelistPage } from "./pages/TypelistPage"

test.use({ storageState: "playwright/.auth/user.json" })

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

const handlers = [
	graphql.query<routeNavUserQuery$rawResponse, routeNavUserQuery$variables>(
		"routeNavUserQuery",
		() =>
			HttpResponse.json({
				data: {
					user: {
						id: 1,
						about: "",
						name: "User",
						avatar: null,
						bannerImage: null,
						isFollowing: null,
						options: null,
					},
				},
			})
	),
	graphql.query<
		routeNavUserIndexQuery$rawResponse,
		routeNavUserIndexQuery$variables
	>("routeNavUserIndexQuery", () =>
		HttpResponse.json({
			data: {
				User: {
					id: 1,
					about: "",
				},
			},
		})
	),
	graphql.query<rootQuery$rawResponse, rootQuery$variables>("rootQuery", () =>
		HttpResponse.json({
			data: {
				Viewer: {
					id: 1,
					name: "User",
					unreadNotificationCount: 0,
				},
			},
		})
	),
	SucccessHandler,
]

test.describe("fullscreen", () => {
	test("navigates to anime list", async ({ page, isMobile, api }) => {
		test.skip(isMobile)
		api.use(handlers)
		await page.goto("/")
		await page.keyboard.press("Control+.")
		let indexPage = await HomePage.new(page)
		// when
		await indexPage.nav.animeList.click()
		// then
		await TypelistPage.new(page)
	})

	test("navigates to navigates to manga list", async ({
		page,
		isMobile,
		api,
	}) => {
		test.skip(isMobile)
		api.use(handlers)
		await page.goto("/")
		await page.keyboard.press("Control+.")
		let indexPage = await HomePage.new(page)
		// when
		await indexPage.nav.profile.click()
		// then
		await TypelistPage.new(page)
	})
})

test("navigates to anime list", async ({ page, api }) => {
	api.use(handlers)
	await page.goto("/")
	await page.keyboard.press("Control+.")
	let indexPage = await HomePage.new(page)
	await indexPage.nav.profile.click()
	const userpage = UserPage.new(page)
	// when
	await userpage.animeList.click()
	// then
	await TypelistPage.new(page)
})

test("navigates to manga list", async ({ page, api }) => {
	api.use(handlers)
	await page.goto("/")
	await page.keyboard.press("Control+.")
	let indexPage = await HomePage.new(page)
	await indexPage.nav.profile.click()
	const userpage = UserPage.new(page)
	// when
	await userpage.mangaList.click()
	// then
	await TypelistPage.new(page)
})
