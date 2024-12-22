import { graphql, HttpResponse, type RequestHandler } from "msw"
import { test as setup, SucccessHandler } from "./fixtures"
import { FeedPage } from "./pages/IndexPage"
import type {
	routeNavLoginQuery,
	routeNavLoginQuery$rawResponse,
	routeNavLoginQuery$variables,
} from "~/gql/routeNavLoginQuery.graphql"

const authFile = "playwright/.auth/user.json"

setup("authenticate", async ({ page, baseURL, api }) => {
	api.use(handlers)
	await page.goto(baseURL ?? "/")
	await page.keyboard.press("Control+.")
	let indexPage = await FeedPage.new(page)
	const loginPage = await indexPage.nav.gotoLogin()
	await loginPage.token.fill(process.env.ANILIST_TEST_TOKEN!)
	await loginPage.login.click()
	await FeedPage.new(page)

	await page.context().storageState({ path: authFile })
})

const handlers = [
	graphql.query<routeNavLoginQuery$rawResponse, routeNavLoginQuery$variables>(
		"routeNavLoginQuery",
		() =>
			HttpResponse.json({
				data: {
					Viewer: {
						id: 1,
						name: "User",
					},
				},
			})
	),
	SucccessHandler,
] satisfies RequestHandler[]
