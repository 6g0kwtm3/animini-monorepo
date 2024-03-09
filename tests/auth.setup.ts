import { test as setup } from "@playwright/test"
import { FeedPage } from "./IndexPage"

const authFile = "playwright/.auth/user.json"

setup("authenticate", async ({ page, baseURL }) => {
	await page.goto(baseURL ?? "/")
	await page.keyboard.press("Control+.")
	let indexPage = await FeedPage.new(page)
	const loginPage = await indexPage.nav.gotoLogin()
	await loginPage.token.fill(process.env.ANILIST_TEST_TOKEN!)
	await loginPage.login.click()
	await FeedPage.new(page)

	await page.context().storageState({ path: authFile })
})
