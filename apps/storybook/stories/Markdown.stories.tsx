import type { Meta, StoryObj } from "@storybook/react-vite"
import { Markdown, type Options } from "markdown/Markdown"
import { use, type ComponentProps } from "react"
import snapshot1 from "./assets/Markdown/Snapshot1/snapshot"
import snapshot2 from "./assets/Markdown/Snapshot2/snapshot"

const meta = {
	title: "Example/Markdown",
	component: Markdown,
	parameters: {
		// More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
		layout: "fullscreen",
	},
} satisfies Meta<typeof Markdown>

export default meta

type Story = StoryObj<typeof meta>

function convert(src: string) {
	return new Promise<string>((resolve, reject) => {
		const img = new globalThis.Image()
		img.addEventListener("error", () => {
			reject(new Error("Failed to load image"))
		})
		img.addEventListener("load", () => {
			const canvas = document.createElement("canvas")

			const ctx = canvas.getContext("2d")
			if (!ctx) {
				reject(new Error("Failed to get canvas context"))
				return
			}
			canvas.width = img.width
			canvas.height = img.height
			ctx.drawImage(img, 0, 0)

			resolve(canvas.toDataURL("image/png", 1))
			URL.revokeObjectURL(img.src)
		})
		img.src = src
	})
}

const cache = new Map<string, Promise<string>>()

function Image(props: ComponentProps<"img">) {
	const src = props.src
	if (!src) return null
	let srcPromise = cache.get(src)
	if (srcPromise === undefined) {
		srcPromise = convert(src)
		cache.set(src, srcPromise)
	}

	return <img {...props} src={use(srcPromise)} />
}

const options: Options = {
	replace: {
		img(props) {
			return <Image {...props}></Image>
		},
	},
}

export const Snapshot = {
	args: { children: snapshot1, options },
} satisfies Story

export const Snapshot2 = {
	args: { children: snapshot2, options },
	decorators: [
		(Story) => (
			<div id="899905726">
				<Story></Story>
			</div>
		),
	],
} satisfies Story
