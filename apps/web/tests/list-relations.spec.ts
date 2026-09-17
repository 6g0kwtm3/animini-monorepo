import type { BrowserContext, Locator, Page } from "@playwright/test"
import { expect } from "@playwright/test"
import { type } from "arktype"
import { graphql, HttpResponse } from "msw"
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

const Viewer = { id: 1, name: "User" }

const contains = (id: string, title: string) => ({
	id: 100 * Number(id),
	relationType: "CONTAINS",
	node: {
		id,
		title: { userPreferred: title },
		coverImage: { color: null, large: null, medium: null },
	},
} as const)

const media = (
	id: string,
	title: string,
	relations: {
		edges: ReadonlyArray<ReturnType<typeof contains>>
	} | null
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

const handlers = [
	graphql.query<
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
	graphql.query<routeNavUserQuery$rawResponse, routeNavUserQuery$variables>(
		"routeNavUserQuery",
		() =>
			HttpResponse.json({
				data: {
					Viewer: { id: numberToString(Viewer.id), name: Viewer.name },
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

test("sync is offered when completed media contains planned media", async ({
	worker,
	newPage,
	context,
}) => {
	worker.use(...handlers)
	await login(context)
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
	context,
}) => {
	worker.use(...handlers)
	await login(context)
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