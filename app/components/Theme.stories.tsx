import { expect, test } from "@playwright/experimental-ct-react"

function Theme() {
	return <div></div>
}

test.describe.only("theme", () => {
	test("should match screenshot", async ({ mount }) => {
		const component = await mount(<Theme />)
		await expect(component).toHaveScreenshot()
	})
})
