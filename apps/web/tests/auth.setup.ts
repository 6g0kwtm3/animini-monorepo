import { test as setup } from "@playwright/test"
import { type } from "arktype"
import { invariant } from "~/lib/invariant"
import { FeedPage } from "./pages/IndexPage"

const authFile = "playwright/.auth/user.json"

const env = invariant(type({ ANILIST_TEST_TOKEN: "string" })(process.env))

setup("authenticate", async ({ page, baseURL }) => {
	await page.goto(baseURL ?? "/")
	await page.keyboard.press("Control+.")
	const indexPage = await FeedPage.new(page)
	const loginPage = await indexPage.nav.gotoLogin()
	await loginPage.token.fill(env.ANILIST_TEST_TOKEN)
	await loginPage.login.click()
	await FeedPage.new(page)

	await page.context().storageState({ path: authFile })
})
