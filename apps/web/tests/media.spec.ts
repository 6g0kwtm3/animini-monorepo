import { expect, type Page } from "@playwright/test"
import { HttpResponse } from "msw"
import type {
	routeNavMediaQuery$rawResponse,
	routeNavMediaQuery$variables,
} from "~/gql/routeNavMediaQuery.graphql"
import type {
	routeNavSearchQuery$rawResponse,
	routeNavSearchQuery$variables,
} from "~/gql/routeNavSearchQuery.graphql"
import { anilist, SuccessHandler, test } from "./fixtures"
import { FeedPage } from "./pages/IndexPage"
import { MediaPage } from "./pages/MediaPage"
import { SearchPage } from "./pages/SearchPage"

const VIEWER = { id: 1, name: "User" }

const FRIEREN_ID = 123
const FRIEREN_TITLE = "Sousou no Frieren"

/** Search still indexes this id, but there's no media behind it any more. */
const MISSING_ID = 999
const MISSING_TITLE = "Shinmai no Yuushagata"

/** A real image, without reaching for the network. */
const COVER =
	"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"

const DESCRIPTION = "Frieren keeps travelling long after the heroes are gone."

// Stands in for AniList: a media only exists if you ask for an id that has one, so
// a request for the wrong id cannot accidentally look like a pass.
const CATALOGUE = new Map<
	number,
	NonNullable<routeNavMediaQuery$rawResponse["Media"]>
>([
	[
		FRIEREN_ID,
		{
			id: String(FRIEREN_ID),
			title: { userPreferred: FRIEREN_TITLE },
			description: `<p>${DESCRIPTION}</p>`,
			coverImage: {
				color: "#2f2f3f",
				extraLarge: COVER,
				large: COVER,
				medium: COVER,
			},
		},
	],
])

// What a search turns up: both titles, so opening the missing one is a thing a
// visitor can do rather than a URL only the test knows.
const SEARCH_INDEX: NonNullable<
	routeNavSearchQuery$rawResponse["page"]
>["media"] = [
	{
		id: String(FRIEREN_ID),
		title: { userPreferred: FRIEREN_TITLE },
		coverImage: null,
		type: "ANIME",
	},
	{
		id: String(MISSING_ID),
		title: { userPreferred: MISSING_TITLE },
		coverImage: null,
		type: "ANIME",
	},
]

const handlers = [
	anilist.query<routeNavSearchQuery$rawResponse, routeNavSearchQuery$variables>(
		"routeNavSearchQuery",
		() => HttpResponse.json({ data: { page: { media: SEARCH_INDEX } } })
	),
	anilist.query<routeNavMediaQuery$rawResponse, routeNavMediaQuery$variables>(
		"routeNavMediaQuery",
		({ variables }) =>
			HttpResponse.json({
				data: { Media: CATALOGUE.get(variables.id) ?? null },
			})
	),
	SuccessHandler,
]

/** How a visitor reaches a media page: look the title up in search, open the result. */
async function openMedia(page: Page, title: string) {
	await FeedPage.new(page)
	await page.keyboard.press("Control+k")
	const search = SearchPage.new(page)
	await search.search.fill(title)
	await search.options.filter({ hasText: title }).click()
}

test("showing the media that was asked for", async ({ newPage, worker }) => {
	worker.use(...handlers)
	await using page = await newPage()
	await openMedia(page, FRIEREN_TITLE)

	const mediaPage = await MediaPage.new(page)
	await expect(mediaPage.title).toHaveText(FRIEREN_TITLE)
	await expect(mediaPage.cover).toBeVisible()
	await expect(page.getByText(DESCRIPTION)).toBeVisible()
})

test("saying so when the media does not exist", async ({ newPage, worker }) => {
	worker.use(...handlers)
	await using page = await newPage()
	await openMedia(page, MISSING_TITLE)

	await expect(page.getByText("Media not found")).toBeVisible()
})

test("opening the editor for the media on screen", async ({
	newPage,
	worker,
	login,
}) => {
	worker.use(...handlers)
	await login(VIEWER)
	await using page = await newPage()
	await openMedia(page, FRIEREN_TITLE)

	const mediaPage = await MediaPage.new(page)
	await mediaPage.edit.click()

	await expect(page).toHaveURL(new RegExp(`/media/${FRIEREN_ID}/edit`))
})

test("asking a signed-out visitor to sign in before editing", async ({
	newPage,
	worker,
	context,
}) => {
	worker.use(...handlers)
	// Electron keeps its session between runs, so the signed-out start is set up
	// here rather than assumed.
	await context.clearCookies()
	await using page = await newPage()
	await openMedia(page, FRIEREN_TITLE)

	const mediaPage = await MediaPage.new(page)
	await mediaPage.loginToEdit.click()

	await expect(page).toHaveURL(
		new RegExp(`/login\\?redirect=%2Fmedia%2F${FRIEREN_ID}%2Fedit`)
	)
})
