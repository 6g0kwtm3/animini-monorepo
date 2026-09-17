import { expect } from "@playwright/test"
import { graphql, HttpResponse } from "msw"
import routeNavLoginQuery, {
	type routeNavLoginQuery$rawResponse,
	type routeNavLoginQuery$variables,
} from "~/gql/routeNavLoginQuery.graphql"
import { SuccessHandler, test } from "./fixtures"
import { FeedPage } from "./pages/IndexPage"
import { LoginPage } from "./pages/Nav"

// AniList's server deviates from the GraphQL specification: it returns errors
// with a non-standard top-level `status` field instead of putting it in
// `extensions`. Augment so mocked error responses can mirror the real server.
declare module "graphql" {
	interface GraphQLError {
		status?: number
	}
}

const TOKEN = "test-token"
const Viewer = { id: "1", name: "User" }

const validTokenHandlers = [
	graphql.query<routeNavLoginQuery$rawResponse, routeNavLoginQuery$variables>(
		routeNavLoginQuery.fragment.name,
		({ request }) =>
			request.headers.get("authorization") === `Bearer ${TOKEN}`
				? HttpResponse.json({ data: { Viewer } })
				: HttpResponse.json({
						data: { Viewer: null },
						errors: [
							{
								message: "Unauthorized.",
								status: 401,
								locations: [{ line: 2, column: 3 }],
							},
						],
					})
	),
	SuccessHandler,
]

const invalidTokenHandlers = [
	graphql.query<routeNavLoginQuery$rawResponse, routeNavLoginQuery$variables>(
		routeNavLoginQuery.fragment.name,
		() =>
			HttpResponse.json({
				data: { Viewer: null },
				errors: [
					{
						message: "Unauthorized.",
						status: 401,
						locations: [{ line: 2, column: 3 }],
					},
				],
			})
	),
	SuccessHandler,
]

test("logging in with a valid token signs the user in", async ({
	newPage,
	worker,
	isElectron,
	browserName,
}) => {
	test.skip(isElectron, "Electron doesn't support goto")
	worker.use(...validTokenHandlers)
	await using page = await newPage()
	await expect(page.getByTestId("hydrated")).toBeVisible()

	test.skip(
		browserName === "webkit",
		"the login flow depends on the Cookie Store API, which WebKit doesn't implement"
	)

	const indexPage = await FeedPage.new(page)
	const nav = indexPage.nav
	await page.goto("/login")
	const loginPage = await LoginPage.new(page)
	await loginPage.token.fill(TOKEN)
	await loginPage.login.click()

	await expect(page).toHaveURL(/\/user\/User\/animelist/)
	await expect(nav.profile).toBeVisible()
	await expect(nav.login).toHaveCount(0)

	const cookie = (await page.context().cookies()).find(
		(cookie) => cookie.name === "anilist-token"
	)
	if (cookie?.value == null) throw new Error("cookie not found")
	expect(JSON.parse(cookie.value)).toEqual({
		token: TOKEN,
		viewer: { id: 1, name: "User" },
	})
})

test("logging in with an invalid token keeps the user logged out", async ({
	newPage,
	worker,
	isElectron,
	browserName,
}) => {
	test.skip(
		isElectron,
		"Electron persists a session, so the logged-out start can't be guaranteed"
	)
	worker.use(...invalidTokenHandlers)
	await using page = await newPage()
	await expect(page.getByTestId("hydrated")).toBeVisible()

	test.skip(
		browserName === "webkit",
		"the login flow depends on the Cookie Store API, which WebKit doesn't implement"
	)

	const indexPage = await FeedPage.new(page)
	const loginPage = await indexPage.nav.gotoLogin()
	await loginPage.token.fill(`${TOKEN}-invalid`)
	await loginPage.login.click()

	await expect(page).toHaveURL(/\/login/)
	await expect(indexPage.nav.login).toBeVisible()
	await expect(indexPage.nav.profile).toHaveCount(0)

	const cookies = await page.context().cookies()
	expect(
		cookies.find((cookie) => cookie.name === "anilist-token")
	).toBeUndefined()
})
