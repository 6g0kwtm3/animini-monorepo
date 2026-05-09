import type { BrowserContext, Locator, Page } from "@playwright/test"
import { expect } from "@playwright/test"
import { type } from "arktype"
import { graphql, HttpResponse } from "msw"
import type {
	AddToListMutation$rawResponse,
	AddToListMutation$variables,
} from "~/gql/AddToListMutation.graphql"
import type {
	SyncMediaMutation$rawResponse,
	SyncMediaMutation$variables,
} from "~/gql/SyncMediaMutation.graphql"
import type {
	routeNavUserListEntriesQuery$rawResponse,
	routeNavUserListEntriesQuery$variables,
} from "~/gql/routeNavUserListEntriesQuery.graphql"
import type {
	routeNavUserQuery$rawResponse,
	routeNavUserQuery$variables,
} from "~/gql/routeNavUserQuery.graphql"
import { invariant } from "~/lib/invariant"
import { Token } from "~/lib/viewer"
import { SuccessHandler, test } from "./fixtures"
import { FeedPage } from "./pages/IndexPage"
import { TypelistPage } from "./pages/TypelistPage"
// test.use({ storageState: "playwright/.auth/user.json" })

class UserPage {
	animeList: Locator
	mangaList: Locator
	private constructor(page: Page) {
		this.animeList = page
			.getByRole("main")
			.getByRole("tab", { name: "Anime list" })
		this.mangaList = page
			.getByRole("main")
			.getByRole("tab", { name: "Manga list" })
	}
	static new(page: Page) {
		return new UserPage(page)
	}
}

const Viewer = { id: 1, name: "User" }
const handlers = [
	graphql.mutation<AddToListMutation$rawResponse, AddToListMutation$variables>(
		"AddToListMutation",
		({ variables }) =>
			HttpResponse.json({
				data: {
					SaveMediaListEntry: {
						__typename: "MediaList",
						status: variables.status ?? "CURRENT",
						id: variables.mediaId,
						completedAt: null,
						private: variables.private,
						progress: 0,
						score: 2,
						startedAt: { day: 1, month: 2, year: 3 },
						media: {
							id: variables.mediaId,
							title: { userPreferred: "Contained media title" },
							type: "MANGA",
							status: "FINISHED",
							relations: {
								edges: [
									{
										id: 200,
										relationType: "COMPILATION",
										node: {
											id: 1,
											title: { userPreferred: "Media title" },
											coverImage: { color: null, large: null, medium: null },
										},
									},
								],
							},
							episodes: null,
							coverImage: { color: null, large: null, medium: null },
							chapters: 1,
						},
					},
				},
			})
	),
	graphql.mutation<SyncMediaMutation$rawResponse, SyncMediaMutation$variables>(
		"SyncMediaMutation",
		({ variables }) =>
			HttpResponse.json({
				data: {
					SaveMediaListEntry: {
						__typename: "MediaList",
						status: variables.status,
						id: variables.mediaId,
						completedAt: variables.completedAt && {
							day: variables.completedAt.day,
							month: variables.completedAt.month,
							year: variables.completedAt.year,
						},
						private: variables.private,
						progress: 1,
						score: 2,
						startedAt: variables.startedAt && {
							day: variables.startedAt.day,
							month: variables.startedAt.month,
							year: variables.startedAt.year,
						},
						media: {
							id: variables.mediaId,
							title: { userPreferred: "Contained media title" },
							type: "MANGA",
							status: "FINISHED",
							relations: {
								edges: [
									{
										id: 200,
										relationType: "COMPILATION",
										node: {
											id: 1,
											title: { userPreferred: "Media title" },
											coverImage: { color: null, large: null, medium: null },
										},
									},
								],
							},
							episodes: null,
							coverImage: { color: null, large: null, medium: null },
							chapters: 1,
						},
					},
				},
			})
	),
	graphql.query<
		routeNavUserListEntriesQuery$rawResponse,
		routeNavUserListEntriesQuery$variables
	>(
		"routeNavUserListEntriesQuery",
		() =>
			HttpResponse.json({
				data: {
					MediaListCollection: {
						lists: [
							{
								__typename: "MediaListGroup",
								status: "COMPLETED",
								name: "List",
								entries: [
									{
										__typename: "MediaList",
										status: "COMPLETED",
										id: 1,
										completedAt: { day: 0, month: 1, year: 2 },
										private: true,
										progress: 12,
										score: 2,
										startedAt: { day: 1, month: 2, year: 3 },
										media: {
											id: 1,
											title: { userPreferred: "Media title" },
											type: "MANGA",
											status: "FINISHED",
											relations: {
												edges: [
													{
														id: 100,
														relationType: "CONTAINS",
														node: {
															id: 2,
															title: { userPreferred: "Contained media title" },
															coverImage: {
																color: null,
																large: null,
																medium: null,
															},
														},
													},
												],
											},
											episodes: null,
											coverImage: { color: null, large: null, medium: null },
											chapters: 12,
										},
									},
								],
							},
						],
					},
				},
			}),
		{ once: true }
	),
	graphql.query<
		routeNavUserListEntriesQuery$rawResponse,
		routeNavUserListEntriesQuery$variables
	>("routeNavUserListEntriesQuery", () =>
		HttpResponse.json({
			data: {
				MediaListCollection: {
					lists: [
						{
							__typename: "MediaListGroup",
							status: "COMPLETED",
							name: "List",
							entries: [
								{
									__typename: "MediaList",
									status: "COMPLETED",
									id: 1,
									completedAt: { day: 0, month: 1, year: 2 },
									private: true,
									progress: 12,
									score: 2,
									startedAt: { day: 1, month: 2, year: 3 },
									media: {
										id: 1,
										title: { userPreferred: "Media title" },
										type: "MANGA",
										status: "FINISHED",
										relations: {
											edges: [
												{
													id: 100,
													relationType: "CONTAINS",
													node: {
														id: 2,
														title: { userPreferred: "Contained media title" },
														coverImage: {
															color: null,
															large: null,
															medium: null,
														},
													},
												},
											],
										},
										episodes: null,
										coverImage: { color: null, large: null, medium: null },
										chapters: 12,
									},
								},
								{
									__typename: "MediaList",
									status: "COMPLETED",
									id: 2,
									completedAt: { day: 0, month: 1, year: 2 },
									private: true,
									progress: 1,
									score: 2,
									startedAt: { day: 1, month: 2, year: 3 },
									media: {
										id: 2,
										title: { userPreferred: "Contained media title" },
										type: "MANGA",
										status: "FINISHED",
										relations: {
											edges: [
												{
													id: 200,
													relationType: "COMPILATION",
													node: {
														id: 1,
														title: { userPreferred: "Media title" },
														coverImage: {
															color: null,
															large: null,
															medium: null,
														},
													},
												},
											],
										},
										episodes: null,
										coverImage: { color: null, large: null, medium: null },
										chapters: 1,
									},
								},
							],
						},
					],
				},
			},
		})
	),

	graphql.query<routeNavUserQuery$rawResponse, routeNavUserQuery$variables>(
		"routeNavUserQuery",
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
		// node doesn't support Temporal
		// Temporal.Now.instant().add({ weeks: 8 }).epochMilliseconds / 1000,
		path: "/",
		domain: "localhost",
	},
] satisfies Parameters<BrowserContext["addCookies"]>[0]

// test.fixme(true, "fix main page")

test.beforeEach(async ({ worker, context }) => {
	worker.use(...handlers)
	await context.addCookies(cookies)
})

test.describe("fullscreen", () => {
	test("anime list", async ({ page, isMobile, isElectron }) => {
		test.skip(isMobile || isElectron)

		const indexPage = await FeedPage.new(page)
		// when
		await indexPage.nav.animeList.click()
		// then
		await TypelistPage.new(page)
	})

	test("manga list", async ({ page, isMobile, isElectron }) => {
		test.skip(isMobile || isElectron)

		const indexPage = await FeedPage.new(page)
		// when
		await indexPage.nav.mangaList.click()
		// then
		await TypelistPage.new(page)
	})

	test("sync media", async ({ page, isElectron, isMobile }) => {
		test.skip(isMobile || isElectron)
		const indexPage = await FeedPage.new(page)
		await indexPage.nav.profile.click()
		const userpage = UserPage.new(page)
		await userpage.mangaList.click()
		const typelist = await TypelistPage.new(page)
		const entry = typelist.entry(/Media title/)
		const containedEntry = typelist.entry(/Contained media title/)
		// when
		await entry.sync.click()
		// then
		await expect(containedEntry.progress).toHaveText(/1/)
		await expect(containedEntry.privateBadge).toBeAttached()
	})
})

test("anime list", async ({ page }) => {
	const indexPage = await FeedPage.new(page)
	await indexPage.nav.profile.click()
	const userpage = UserPage.new(page)
	// when
	await userpage.animeList.click()
	// then
	await TypelistPage.new(page)
})

test("manga list", async ({ page }) => {
	const indexPage = await FeedPage.new(page)
	await indexPage.nav.profile.click()
	const userpage = UserPage.new(page)
	// when
	await userpage.mangaList.click()
	// then
	await TypelistPage.new(page)
})

test("add to list", async ({ page }) => {
	const indexPage = await FeedPage.new(page)
	await indexPage.nav.profile.click()
	const userpage = UserPage.new(page)
	await userpage.mangaList.click()
	const typelist = await TypelistPage.new(page)
	const entry = typelist.entry(/Media title/)
	const containedEntry = typelist.entry(/Contained media title/)
	// when
	await entry.addToList.click()
	// then
	await expect(containedEntry.progress).toHaveText(/0/)
	await expect(containedEntry.privateBadge).toBeAttached()
})
