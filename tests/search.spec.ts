import { expect } from "@playwright/test"
import { graphql, HttpResponse } from "msw"
import type {
	routeNavMediaQuery$rawResponse,
	routeNavMediaQuery$variables,
} from "~/gql/routeNavMediaQuery.graphql"
import routeNavMediaQuery from "~/gql/routeNavMediaQuery.graphql"
import type {
	routeNavSearchQuery$rawResponse,
	routeNavSearchQuery$variables,
} from "~/gql/routeNavSearchQuery.graphql"
import routeNavSearchQuery from "~/gql/routeNavSearchQuery.graphql"
import { SucccessHandler, test } from "./fixtures"
import { MediaPage } from "./pages/MediaPage"
import { SearchPage } from "./pages/SearchPage"

test("when search, ArrowDown should change focus", async ({ page, api }) => {
	api.use(handlers)
	await page.goto("/")
	await page.keyboard.press("Control+.")
	await expect(page.getByTestId("hydrated")).toBeVisible()
	await page.keyboard.press("Control+k")
	const searchPage = SearchPage.new(page)
	await searchPage.search.fill("sousou no frieren")
	await expect(searchPage.active).toHaveText(/Sousou no Frieren/)
	// when
	await searchPage.search.press("ArrowDown")
	// then
	await expect(await searchPage.active.textContent()).toBe(
		await searchPage.options.nth(1).textContent()
	)
})

test("search", async ({ page, api }) => {
	api.use(handlers)
	await page.goto("/")
	await page.keyboard.press("Control+.")
	await expect(page.getByTestId("hydrated")).toBeVisible()
	await page.keyboard.press("Control+k")
	const searchPage = SearchPage.new(page)
	await searchPage.search.fill("sousou no frieren")
	await expect(searchPage.active).toHaveText(/Sousou no Frieren/)
	// when
	await searchPage.search.press("Enter")
	// then
	const mediaPage = await MediaPage.new(page)
	await expect(mediaPage.title).toHaveText("Sousou no Frieren")
})

const handlers = [
	graphql.query<routeNavSearchQuery$rawResponse, routeNavSearchQuery$variables>(
		routeNavSearchQuery.fragment.name,
		() =>
			HttpResponse.json({
				data: {
					page: {
						media: [
							{
								coverImage: null,
								id: 1,
								title: {
									userPreferred: "Sousou no Frieren",
								},
								type: "ANIME",
							},
							{
								coverImage: null,
								id: 2,
								title: {
									userPreferred: "Sousou no Frieren",
								},
								type: "MANGA",
							},
							{
								coverImage: null,
								id: 3,
								title: {
									userPreferred: "Sousou no Frieren 2nd Season",
								},
								type: "ANIME",
							},
						],
					},
				},
			})
	),
	graphql.query<routeNavMediaQuery$rawResponse, routeNavMediaQuery$variables>(
		routeNavMediaQuery.fragment.name,
		() =>
			HttpResponse.json({
				data: {
					Media: {
						coverImage: null,
						id: 1,
						title: {
							userPreferred: "Sousou no Frieren",
						},
						bannerImage: null,
						description: "",
					},
				},
			})
	),
	SucccessHandler,
]
