import { numberToString } from "@animedes/components/numberToString"
import { expect } from "@playwright/test"
import { HttpResponse } from "msw"

import {
	anilist,
	CANARY_ID,
	CANARY_NAME,
	SuccessHandler,
	test,
} from "./fixtures"
import { FeedPage } from "./pages/IndexPage"
import { TypelistPage } from "./pages/TypelistPage"

import type { Locator, Page } from "@playwright/test"
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

const Viewer = { id: CANARY_ID, name: CANARY_NAME }

const contains = (id: string, title: string) =>
	({
		id: 100 * Number(id),
		relationType: "CONTAINS",
		node: {
			id,
			title: { userPreferred: title },
			coverImage: { color: null, large: null, medium: null },
		},
	}) as const

const compilation = (id: string, title: string) =>
	({
		id: 100 * Number(id) + 1,
		relationType: "COMPILATION",
		node: {
			id,
			title: { userPreferred: title },
			coverImage: { color: null, large: null, medium: null },
		},
	}) as const

const media = (
	id: string,
	title: string,
	relations: null | {
		edges: readonly (
			| ReturnType<typeof compilation>
			| ReturnType<typeof contains>
		)[]
	}
) => ({
	id,
	title: { userPreferred: title },
	type: "MANGA" as const,
	status: "FINISHED" as const,
	nextAiringEpisode: null,
	duration: 20,
	relations,
	episodes: null,
	coverImage: { color: null, large: null, medium: null },
	chapters: 12,
})

const entry = (
	id: string,
	title: string,
	status: "COMPLETED" | "CURRENT" | "PLANNING",
	mediaData: ReturnType<typeof media>
) => ({
	__typename: "MediaList" as const,
	status,
	id,
	completedAt: status === "COMPLETED" ? { day: 1, month: 2, year: 3 } : null,
	private: false,
	progress: status === "COMPLETED" ? 12 : status === "CURRENT" ? 3 : 0,
	score: 2,
	startedAt: status === "PLANNING" ? null : { day: 1, month: 2, year: 3 },
	media: mediaData,
})

const userQuery = anilist.query<
	routeNavUserQuery$rawResponse,
	routeNavUserQuery$variables
>("routeNavUserQuery", () =>
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
							name: "Completed",
							entries: [
								entry(
									"1",
									"Completed manga",
									"COMPLETED",
									media("1", "Completed manga", {
										edges: [contains("2", "Planned manga")],
									})
								),
							],
						},
						{
							__typename: "MediaListGroup",
							status: "PLANNING",
							name: "Planning",
							entries: [
								entry(
									"2",
									"Planned manga",
									"PLANNING",
									media("2", "Planned manga", null)
								),
							],
						},
						{
							__typename: "MediaListGroup",
							status: "CURRENT",
							name: "Current",
							entries: [
								entry(
									"3",
									"Current manga",
									"CURRENT",
									media("3", "Current manga", {
										edges: [contains("4", "Not on list manga")],
									})
								),
							],
						},
					],
				},
			},
		})
	),
	userQuery,
	SuccessHandler,
]

/** A media containing a media, which itself contains two media. */
const nestedHandlers = [
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
							name: "Completed",
							entries: [
								entry(
									"1",
									"Parent manga",
									"COMPLETED",
									media("1", "Parent manga", {
										edges: [contains("2", "Child manga")],
									})
								),
							],
						},
						{
							__typename: "MediaListGroup",
							status: "PLANNING",
							name: "Planning",
							entries: [
								entry(
									"2",
									"Child manga",
									"PLANNING",
									media("2", "Child manga", {
										edges: [
											compilation("1", "Parent manga"),
											contains("5", "Nested manga"),
											contains("6", "Untracked nested manga"),
										],
									})
								),
								entry(
									"5",
									"Nested manga",
									"PLANNING",
									media("5", "Nested manga", {
										edges: [compilation("2", "Child manga")],
									})
								),
							],
						},
					],
				},
			},
		})
	),
	userQuery,
	SuccessHandler,
]

/** A media contained by a media that is not tracked. */
const orphanHandlers = [
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
							status: "PLANNING",
							name: "Planning",
							entries: [
								entry(
									"7",
									"Orphan manga",
									"PLANNING",
									media("7", "Orphan manga", {
										edges: [compilation("8", "Untracked parent manga")],
									})
								),
							],
						},
					],
				},
			},
		})
	),
	userQuery,
	SuccessHandler,
]

const syncMediaMutation = (syncedMediaIds: number[]) =>
	anilist.mutation<SyncMediaMutation$rawResponse, SyncMediaMutation$variables>(
		"SyncMediaMutation",
		({ variables }) => {
			void syncedMediaIds.push(variables.mediaId)
			return HttpResponse.json({
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
							title: { userPreferred: "Synced media title" },
							type: "MANGA",
							status: "FINISHED",
							nextAiringEpisode: null,
							duration: null,
							relations: { edges: [] },
							episodes: null,
							coverImage: { color: null, large: null, medium: null },
							chapters: 1,
						},
					},
				},
			})
		}
	)

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

async function openMangaList(page: Page) {
	const indexPage = await FeedPage.new(page)
	await indexPage.nav.profile.click()
	const userpage = UserPage.new(page)
	await userpage.mangaList.click()
	return await TypelistPage.new(page)
}

test("sync is offered when completed media contains planned media", async ({
	worker,
	newPage,
	login,
}) => {
	worker.use(...handlers)
	await login(Viewer)
	await using page = await newPage()
	const indexPage = await FeedPage.new(page)
	await indexPage.nav.profile.click()
	const userpage = UserPage.new(page)
	await userpage.mangaList.click()
	const typelist = await TypelistPage.new(page)
	const completedEntry = typelist.entry(/Completed manga/)
	const plannedEntry = typelist.entry(/Planned manga/)
	// then
	await expect(completedEntry.sync).toBeVisible()
	await expect(plannedEntry.addToList).toHaveCount(0)
})

test("add to list is offered when current media contains media without an entry", async ({
	worker,
	newPage,
	login,
}) => {
	worker.use(...handlers)
	await login(Viewer)
	await using page = await newPage()
	const indexPage = await FeedPage.new(page)
	await indexPage.nav.profile.click()
	const userpage = UserPage.new(page)
	await userpage.mangaList.click()
	const typelist = await TypelistPage.new(page)
	const currentEntry = typelist.entry(/Current manga/)
	const unlistedEntry = typelist.entry(/Not on list manga/)
	// then
	await expect(unlistedEntry.addToList).toBeVisible()
	await expect(currentEntry.sync).toHaveCount(0)
})

test("media contained by other media are listed under it", async ({
	worker,
	newPage,
	login,
}) => {
	worker.use(...nestedHandlers)
	await login(Viewer)
	await using page = await newPage()
	const typelist = await openMangaList(page)
	// then
	await expect(typelist.page.getByTestId("media-list-item")).toHaveText([
		/Parent manga/,
		/Child manga/,
		/Nested manga/,
		/Untracked nested manga/,
	])
})

test("sync targets the whole subtree", async ({ worker, newPage, login }) => {
	const syncedMediaIds: number[] = []
	worker.use(syncMediaMutation(syncedMediaIds), ...nestedHandlers)
	await login(Viewer)
	await using page = await newPage()
	const typelist = await openMangaList(page)
	// when
	await typelist.entry(/Parent manga/).sync.click()
	// then
	await expect.poll(() => syncedMediaIds).toEqual([2, 5, 6])
})

test("media contained by media that are not tracked are still listed", async ({
	worker,
	newPage,
	login,
}) => {
	worker.use(...orphanHandlers)
	await login(Viewer)
	await using page = await newPage()
	const typelist = await openMangaList(page)
	const parent = typelist.entry(/Untracked parent manga/)
	const orphan = typelist.entry(/Orphan manga/)
	// then
	await expect(parent.addToList).toBeVisible()
	await expect(orphan.progress).toHaveText(/0/)
	await expect(orphan.addToList).toHaveCount(0)
})
