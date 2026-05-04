import { SuccessHandler, test } from "./fixtures"
import { FeedPage } from "./pages/IndexPage"

const authFile = "playwright/.auth/user.json"

test("authenticate", async ({ page, worker }) => {
	worker.use(SuccessHandler)

	await page.keyboard.press("Control+.")
	const indexPage = await FeedPage.new(page)
	const loginPage = await indexPage.nav.gotoLogin()
	await loginPage.token.fill("Foo bar")
	await loginPage.login.click()
	await FeedPage.new(page)

	await page.context().storageState({ path: authFile })
})
