import { expect, test } from "@playwright/test"
// we can't create tests asynchronously, thus using the sync-fetch lib
import fetch from "sync-fetch"

// URL where Ladle is served
const url = "http://localhost:61000"

// fetch Ladle's meta file
// https://ladle.dev/docs/meta
const metaJson = fetch(`${url}/meta.json`).json()

// iterate through stories

for (const [storyKey, { levels, name, meta }] of Object.entries(metaJson.stories)) {
	if (meta.skip) {
		continue
	}

	// create a test for each story
	levels.reduce(
		(acc, el) => () => test.describe(el, acc),
		() => {
			test(`${name} should match snapshots`, async ({ page }) => {
				// navigate to the story
				await page.goto(`${url}/?story=${storyKey}&mode=preview`)
				// stories are code-splitted, wait for them to be loaded
				await page.waitForSelector("[data-storyloaded]")
				// take a screenshot and compare it with the baseline
				await expect(page).toHaveScreenshot(`${storyKey}.png`)
			})
		}
	)()
}
