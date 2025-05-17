import { markdownToHtml } from "markdown"
function numberToString(n: number): string {
	return String(n)
}
export async function loadAssets(
	assets: Record<string, string>,
	outputDir: string
) {
	for (const [key, rawSnapshot] of Object.entries(assets)) {
		const images: Record<string, string> = {}

		const rewriter = new HTMLRewriter().on("img", {
			element(img) {
				const src = img.getAttribute("src")
				if (!src) return
				const url = new URL(src)
				const filename = url.pathname.split("/").pop()
				if (!filename) throw new Error("Invalid image url")
				const ext = filename.split(".").pop()
				if (!ext) throw new Error("Invalid image url")
				images[src] = ext
			},
		})

		const html = markdownToHtml(rawSnapshot, (html) => html)

		rewriter.transform(html)

		let result = ""
		const urls = Object.keys(images)
		outer: for (let i = 0; i < rawSnapshot.length; i++) {
			for (const [index, url] of urls.entries()) {
				if (rawSnapshot.startsWith(url, i)) {
					result += `\${img${numberToString(index)}}`
					i += url.length - 1
					continue outer
				}
			}

			result += rawSnapshot.substring(i, i + 1)
		}

		await Promise.all(
			Object.entries(images).map(([src, ext], i) => {
				return fetch(src).then((response) => {
					return Bun.write(
						path.join(outputDir, key, `img${numberToString(i)}.${ext}`),
						response
					)
				})
			})
		)

		const output = Object.entries(images).map(
			([, ext], i) =>
				`import img${numberToString(i)} from "./img${numberToString(i)}.${ext}?url"`
		)
		output.push(`export default \`${result}\``)
		await Bun.write(path.join(outputDir, key, `snapshot.ts`), output.join("\n"))
	}
}

import path from "path"
