import { numberToString } from "@animedes/components/numberToString"
import { expect } from "@playwright/test"
import { HttpResponse } from "msw"

import { CANARY_ID, SuccessHandler, test } from "./fixtures"
import { FeedPage } from "./pages/IndexPage"
import { TypelistPage } from "./pages/TypelistPage"

import type { Locator, Page } from "@playwright/test"
import type {
	AddToListMutation$rawResponse,
	AddToListMutation$variables,
} from "~/gql/AddToListMutation.graphql"
import type {
	routeNavUserListEntriesQuery$rawResponse,
	routeNavUserListEntriesQuery$variables,
} from "~/gql/routeNavUserListEntriesQuery.graphql"
import type {
	routeNavUserQuery$rawResponse,
	routeNavUserQuery$variables,
} from "~/gql/routeNavUserQuery.graphql"
import type {
	SyncMediaMutation$rawResponse,
	SyncMediaMutation$variables,
} from "~/gql/SyncMediaMutation.graphql"
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
import { anilist, CANARY_NAME } from "./fixtures"
const Viewer = { id: CANARY_ID, name: CANARY_NAME }
const AddToListMutationSuccess = anilist.mutation<
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
					nextAiringEpisode: null,
					duration: null,
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

const SyncMediaMutationSuccess = anilist.mutation<
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
					nextAiringEpisode: null,
					duration: null,
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
	anilist.query<
		routeNavUserListEntriesQuery$rawResponse,
		routeNavUserListEntriesQuery$variables
	>("routeNavUserListEntriesQuery", () =>
		HttpResponse.json({
			data: {
				MediaListCollection: {
					__typename: "MediaListCollection",
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
										nextAiringEpisode: null,
										duration: null,
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
	anilist.query<routeNavUserQuery$rawResponse, routeNavUserQuery$variables>(
		"routeNavUserQuery",
		() =>
			HttpResponse.json({
				data: {
					Viewer: { id: numberToString(Viewer.id), name: Viewer.name },
					user: {
						id: numberToString(Viewer.id),
						name: Viewer.name,
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

// test.fixme(true, "fix main page")

test("fullscreen anime list", async ({
	newPage,
	isMobile,
	isElectron,
	worker,
	login,
}) => {
	test.skip(isMobile || isElectron)
	worker.use(...handlers)
	await login(Viewer)
	await using page = await newPage()

	const indexPage = await FeedPage.new(page)
	// when
	await indexPage.nav.animeList.click()
	// then
	await TypelistPage.new(page)
})

test("fullscreen manga list", async ({
	worker,
	newPage,
	isMobile,
	isElectron,
	login,
}) => {
	test.skip(isMobile || isElectron)
	worker.use(...handlers)
	await login(Viewer)
	await using page = await newPage()
	const indexPage = await FeedPage.new(page)
	// when
	await indexPage.nav.mangaList.click()
	// then
	await TypelistPage.new(page)
})

test("anime list", async ({ worker, newPage, login }) => {
	worker.use(...handlers)
	await login(Viewer)
	await using page = await newPage()
	const indexPage = await FeedPage.new(page)
	await indexPage.nav.profile.click()
	const userpage = UserPage.new(page)
	// when
	await userpage.animeList.click()
	// then
	await TypelistPage.new(page)
})

test("manga list", async ({ worker, newPage, login }) => {
	worker.use(...handlers)
	await login(Viewer)
	await using page = await newPage()
	const indexPage = await FeedPage.new(page)
	await indexPage.nav.profile.click()
	const userpage = UserPage.new(page)
	// when
	await userpage.mangaList.click()
	// then
	await TypelistPage.new(page)
})

test("add to list", async ({ worker, newPage, login }) => {
	worker.use(AddToListMutationSuccess, ...handlers)
	await login(Viewer)
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

test("sync media", async ({ worker, newPage, login }) => {
	worker.use(SyncMediaMutationSuccess, ...handlers)
	await login(Viewer)
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
