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
import { numberToString } from "../app/lib/numberToString"
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
const AddToListMutationSuccess = graphql.mutation<
	AddToListMutation$rawResponse,
	AddToListMutation$variables
>("AddToListMutation", ({ variables }) =>
	HttpResponse.json({
		data: {
			SaveMediaListEntry: {
				__typename: "MediaList",
				status: variables.status,
				id: numberToString(variables.mediaId),
				completedAt: null,
				private: variables.private,
				progress: 0,
				score: 2,
				startedAt: { day: 1, month: 2, year: 3 },
				media: {
					id: numberToString(variables.mediaId),
					title: { userPreferred: "Contained media title" },
					type: "MANGA",
					status: "FINISHED",
					relations: {
						edges: [
							{
								id: 200,
								relationType: "COMPILATION",
								node: {
									id: "1",
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
)

const SyncMediaMutationSuccess = graphql.mutation<
	SyncMediaMutation$rawResponse,
	SyncMediaMutation$variables
>("SyncMediaMutation", ({ variables }) =>
	HttpResponse.json({
		data: {
			SaveMediaListEntry: {
				__typename: "MediaList",
				status: variables.status,
				id: numberToString(variables.mediaId),
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
					id: numberToString(variables.mediaId),
					title: { userPreferred: "Contained media title" },
					type: "MANGA",
					status: "FINISHED",
					relations: {
						edges: [
							{
								id: 200,
								relationType: "COMPILATION",
								node: {
									id: "1",
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
)

const handlers = [
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
									id: "1",
									completedAt: { day: 0, month: 1, year: 2 },
									private: true,
									progress: 12,
									score: 2,
									startedAt: { day: 1, month: 2, year: 3 },
									media: {
										id: "1",
										title: { userPreferred: "Media title" },
										type: "MANGA",
										status: "FINISHED",
										relations: {
											edges: [
												{
													id: 100,
													relationType: "CONTAINS",
													node: {
														id: "2",
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
		})
	),
	graphql.query<routeNavUserQuery$rawResponse, routeNavUserQuery$variables>(
		"routeNavUserQuery",
		() =>
			HttpResponse.json({
				data: {
					Viewer: {
						id: numberToString(Viewer.id),
						name: Viewer.name
					},
					user: {
						id: "1",
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

function login(context: BrowserContext) {
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

	return context.addCookies(cookies)
}

// test.fixme(true, "fix main page")

test("fullscreen anime list", async ({
	newPage,
	isMobile,
	isElectron,
	worker,
	context,
}) => {
	test.skip(isMobile || isElectron)
	worker.use(...handlers)
	await login(context)
	await using page = await newPage()

	const indexPage = await FeedPage.new(page)
	// when
	await indexPage.nav.animeList.click()
	// then
	await TypelistPage.new(page)
})

test("fullscreen manga list", async ({
	worker,
	context,
	newPage,
	isMobile,
	isElectron,
}) => {
	test.skip(isMobile || isElectron)
	worker.use(...handlers)
	await login(context)
	await using page = await newPage()
	const indexPage = await FeedPage.new(page)
	// when
	await indexPage.nav.mangaList.click()
	// then
	await TypelistPage.new(page)
})

test("anime list", async ({ worker, newPage, context }) => {
	worker.use(...handlers)
	await login(context)
	await using page = await newPage()
	const indexPage = await FeedPage.new(page)
	await indexPage.nav.profile.click()
	const userpage = UserPage.new(page)
	// when
	await userpage.animeList.click()
	// then
	await TypelistPage.new(page)
})

test("manga list", async ({ worker, context, newPage }) => {
	worker.use(...handlers)
	await login(context)
	await using page = await newPage()
	const indexPage = await FeedPage.new(page)
	await indexPage.nav.profile.click()
	const userpage = UserPage.new(page)
	// when
	await userpage.mangaList.click()
	// then
	await TypelistPage.new(page)
})

test("add to list", async ({ worker, newPage, context }) => {
	worker.use(AddToListMutationSuccess, ...handlers)
	await login(context)
	await using page = await newPage()
	const indexPage = await FeedPage.new(page)
	await indexPage.nav.profile.click()
	const userpage = UserPage.new(page)
	await userpage.mangaList.click()
	const typelist = await TypelistPage.new(page)
	const containedEntry = typelist.entry(/Contained media title/)
	// when
	await containedEntry.addToList.click()
	// then
	await expect(containedEntry.progress).toHaveText(/0/)
	await expect(containedEntry.privateBadge).toBeAttached()
})
test("sync media", async ({ worker, newPage, context }) => {
	worker.use(SyncMediaMutationSuccess, ...handlers)
	await login(context)
	await using page = await newPage()
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
