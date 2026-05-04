import { defineNetworkFixture, type NetworkFixture } from "@msw/playwright"
import base, {
	type ElectronApplication,
	type TestInfo,
	type Video,
	type VideoMode,
	type ViewportSize,
} from "@playwright/test"

import { addMocksToSchema } from "@graphql-tools/mock"
import { _electron } from "@playwright/test"
import fs from "fs"
import { buildSchema, execute, parse } from "graphql"
import { graphql, http, HttpResponse, type AnyHandler } from "msw"
import { join } from "path"
import { numberToString } from "~/lib/numberToString"

function cached<T>(fn: () => T) {
	let cache: T | undefined
	return () => {
		let result = cache
		if (result === undefined) {
			result = fn()
			cache = result
		}
		return result
	}
}

const schema = cached(async () => {
	const raw = await fs.promises.readFile(
		join(import.meta.dirname, "../schema.graphql"),
		{ encoding: "utf-8" }
	)

	return addMocksToSchema({ schema: buildSchema(raw) })
})

export const SuccessHandler = graphql.operation<object>(async (args) => {
	return HttpResponse.json(
		await execute({
			document: parse(args.query),
			schema: await schema(),
			variableValues: args.variables,
		})
	)
})

interface Options {
	isElectron: boolean
}
export interface Fixtures extends Options {
	handlers: AnyHandler[]
	worker: NetworkFixture
	electron: ElectronApplication | null
	attachScreenshots: undefined
}

export const test = base.extend<Fixtures>({
	// Initial list of the network handlers.
	handlers: [
		[http.post("https://graphql.anilist.co", () => HttpResponse.error())],
		{ option: true },
	],

	// A fixture you use to control the network in your tests.
	worker: [
		async ({ context, handlers }, provide) => {
			const network = defineNetworkFixture({ context, handlers })

			await network.enable()
			await provide(network)
			await network.disable()
		},
		{ auto: true },
	],

	isElectron: [false, { option: true }],

	async electron({ baseURL, isElectron, video }, provide, testInfo) {
		if (!isElectron) {
			await provide(null)
			return
		}
		const options =
			typeof video === "string" ? { mode: video, size: undefined } : video
		const app = await _electron.launch({
			args: ["."],
			env: {
				...process.env,
				...(baseURL ? { EXISTING_SERVER_URL: baseURL } : {}),
			},
			recordVideo:
				options.mode === "retain-on-failure" || isMode(options.mode, testInfo)
					? { dir: testInfo.outputDir, size: options.size }
					: undefined,
			// env: { HONO_PORT: String(5137 + testInfo.workerIndex) },
		})

		await provide(app)
		await app.close()
	},

	async context({ context, electron }, provide) {
		if (electron == null) {
			await provide(context)
			return
		}
		await provide(electron.context())
	},

	async page({ context, electron, video }, provide, testInfo) {
		if (electron == null) {
			await using page = await context.newPage()
			await page.goto("/")
			await provide(page)
			return
		}

		const page = await electron.firstWindow()
		await provide(page)

		await page.close()

		const pageVideo = page.video()
		if (!pageVideo) return
		await retainOrDeleteVideo(pageVideo, video, testInfo)
	},

	attachScreenshots: [
		async (
			{ page, screenshot: screenshotOptions, isElectron },
			provide,
			testInfo
		) => {
			await provide(undefined)

			if (!isElectron) {
				return
			}

			const screenshot =
				typeof screenshotOptions === "string"
					? {
							mode: screenshotOptions,
							fullPage: undefined,
							omitBackground: undefined,
						}
					: screenshotOptions

			// After the test we can check whether the test passed or failed.
			if (
				screenshot.mode === "only-on-failure"
					? isFailure(testInfo)
					: screenshot.mode === "on-first-failure"
						? isFirstFailure(testInfo)
						: isMode(screenshot.mode, testInfo)
			) {
				const img = await page.screenshot({
					fullPage: screenshot.fullPage,
					omitBackground: screenshot.omitBackground,
					path: testInfo.outputPath(
						`test-failed-${numberToString(testInfo.retry + 1)}.png`
					),
				})
				await testInfo.attach("screenshot", {
					body: img,
					contentType: "image/png",
				})
			}
		},
		{ auto: true },
	],
})

function isFirstFailure(testInfo: TestInfo): boolean {
	return isFailure(testInfo) && testInfo.retry === 0
}

function isFailure(testInfo: TestInfo): boolean {
	return testInfo.status !== testInfo.expectedStatus
}

function isMode(
	mode:
		| "off"
		| "on"
		| "on-all-retries"
		| "on-first-retry"
		| "retry-with-trace"
		| "retry-with-video",
	testInfo: TestInfo
): boolean {
	switch (mode) {
		case "off":
			return false
		case "on":
			return true
		case "on-all-retries":
			return testInfo.retry > 0
		case "on-first-retry":
			return testInfo.retry === 1
		case "retry-with-trace":
			throw new Error('unknown mode "retry-with-trace"')
		case "retry-with-video":
			throw new Error('unknown mode "retry-with-video"')
	}
}

async function retainOrDeleteVideo(
	pageVideo: Video,
	video:
		| "retry-with-video"
		| VideoMode
		| { mode: VideoMode; size?: ViewportSize },
	testInfo: TestInfo
) {
	const options =
		typeof video === "string" ? { mode: video, size: undefined } : video

	if (
		options.mode === "retain-on-failure"
			? isFailure(testInfo)
			: isMode(options.mode, testInfo)
	) {
		await pageVideo.saveAs(testInfo.outputPath("video.webm"))
		await testInfo.attach("video", {
			contentType: "video/webm",
			path: testInfo.outputPath("video.webm"),
		})
	} else {
		await pageVideo.delete()
	}
}
