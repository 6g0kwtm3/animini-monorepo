import { afterEach, beforeAll, expect, it } from "vitest"
import { page } from "vitest/browser"
import { render } from "vitest-browser-react"
import { useWindowVirtualizer } from "./use-window-virtualizer"

/* The list under test is 20 rows of 100px with a 20px gap between them, parked
   300px down the page. So row `i` covers the document rows

       [300 + i * 120, 400 + i * 120]

   and with the 768px window pinned by `browser.viewport` in
   `vitest.browser.config.ts`, a window parked at the top of the page shows
   rows 0 to 3. Every expectation below is derived from those numbers. */
const VIEWPORT = { width: 1024, height: 768 }
const ROW_SIZE = 100
const GAP = 20
const STRIDE = ROW_SIZE + GAP
const SCROLL_MARGIN = 300
const ROW_COUNT = 20
/** Every row's stride, minus the gap that would follow the very last row. */
const LIST_HEIGHT = ROW_COUNT * STRIDE - GAP

type Options = Parameters<typeof useWindowVirtualizer>[0]

const listOf = ({
	count = ROW_COUNT,
	estimateSize = () => ROW_SIZE,
	gap = GAP,
	overscan = 0,
	scrollMargin = SCROLL_MARGIN,
}: Partial<Options> = {}): Options => ({
	count,
	estimateSize,
	gap,
	overscan,
	scrollMargin,
})

/* Stands in for the consumer in `route.tsx`: room for everything above the
   list, a box as tall as the reported total size, and the mounted rows placed
   inside it at `start - scrollMargin`. */
function List(options: Options) {
	const { estimateSize } = options
	const { options: used, totalSize, virtualItems } = useWindowVirtualizer(options)

	return (
		<div style={{ paddingTop: used.scrollMargin }}>
			<div role="list" style={{ position: "relative", height: `${totalSize}px` }}>
				{virtualItems.map((item) => (
					<div
						role="listitem"
						key={item.index}
						data-key={item.index}
						style={{
							position: "absolute",
							insetInline: 0,
							top: 0,
							height: `${estimateSize(item.index)}px`,
							transform: `translateY(${item.start - used.scrollMargin}px)`,
						}}
					>
						{item.index}
					</div>
				))}
			</div>
		</div>
	)
}

async function mountList(options: Options) {
	const screen = await render(<List {...options} />)
	const rows = screen.getByRole("listitem")

	return {
		/** The rows currently mounted, as the numbers they display. */
		mounted: () => rows.elements().map((row) => row.textContent),
		/** Where those rows actually sit on the page. */
		placedAt: () =>
			rows.elements().map((row) => row.getBoundingClientRect().top + window.scrollY),
		firstRow: rows.first(),
		lastRow: rows.last(),
		list: screen.getByRole("list"),
		rerender: (next: Options) => screen.rerender(<List {...next} />),
	}
}

/** The user scrolls the window. Any offset past the end parks it at the last row. */
function scrollWindowTo(y: number) {
	window.scrollTo(0, y)
}

function resizeWindowTo(height: number) {
	return page.viewport(VIEWPORT.width, height)
}

beforeAll(() => {
	document.body.style.margin = "0"
})

afterEach(async () => {
	scrollWindowTo(0)
	await resizeWindowTo(VIEWPORT.height)
})

it("mounts only the rows inside the window", async () => {
	const list = await mountList(listOf())

	await expect.poll(list.mounted).toEqual(["0", "1", "2", "3"])
})

it("swaps the mounted rows for the ones the user scrolled to", async () => {
	const list = await mountList(listOf())
	await expect.poll(list.mounted).toEqual(["0", "1", "2", "3"])

	scrollWindowTo(1200)

	await expect.poll(list.mounted).toEqual([
		"7",
		"8",
		"9",
		"10",
		"11",
		"12",
		"13",
	])
})

it("unmounts the rows the user scrolled past", async () => {
	const list = await mountList(listOf())
	await expect.poll(list.mounted).toEqual(["0", "1", "2", "3"])

	scrollWindowTo(Number.MAX_SAFE_INTEGER)

	await expect.poll(list.mounted).toEqual([
		"13",
		"14",
		"15",
		"16",
		"17",
		"18",
		"19",
	])
})

it("keeps a margin of extra rows around the window when overscan is set", async () => {
	const list = await mountList(listOf({ overscan: 2 }))
	await expect.poll(list.mounted).toEqual(["0", "1", "2", "3", "4", "5"])

	scrollWindowTo(1200)

	await expect.poll(list.mounted).toEqual([
		"5",
		"6",
		"7",
		"8",
		"9",
		"10",
		"11",
		"12",
		"13",
		"14",
		"15",
	])
})

it("stops the overscan at the top of the list", async () => {
	const list = await mountList(listOf({ overscan: 5 }))

	await expect.poll(list.mounted).toEqual([
		"0",
		"1",
		"2",
		"3",
		"4",
		"5",
		"6",
		"7",
		"8",
	])
})

it("stops the overscan at the end of the list", async () => {
	const list = await mountList(listOf({ overscan: 5 }))
	scrollWindowTo(Number.MAX_SAFE_INTEGER)

	await expect.poll(list.mounted).toEqual([
		"8",
		"9",
		"10",
		"11",
		"12",
		"13",
		"14",
		"15",
		"16",
		"17",
		"18",
		"19",
	])
})

it("sizes the page to fit every row and the gaps between them, with no trailing gap", async () => {
	const list = await mountList(listOf())

	await expect.element(list.list).toHaveStyle({ height: `${LIST_HEIGHT}px` })
})

it("puts the mounted rows one stride apart, starting at the list's offset in the page", async () => {
	const list = await mountList(listOf())

	await expect.poll(list.placedAt).toEqual([
		SCROLL_MARGIN,
		SCROLL_MARGIN + STRIDE,
		SCROLL_MARGIN + STRIDE * 2,
		SCROLL_MARGIN + STRIDE * 3,
	])
})

it("sizes each row with its own estimate", async () => {
	const list = await mountList({
		count: 10,
		estimateSize: (index) => (index < 5 ? 200 : 50),
		gap: 0,
		overscan: 0,
		scrollMargin: 0,
	})

	await expect.poll(list.mounted).toEqual(["0", "1", "2", "3"])
	await expect.element(list.list).toHaveStyle({ height: `${5 * 200 + 5 * 50}px` })
})

it("keeps the mounted window the same width when more rows arrive", async () => {
	const list = await mountList(listOf({ count: 5, scrollMargin: 0 }))
	await expect.poll(list.mounted).toEqual(["0", "1", "2", "3", "4"])

	await list.rerender(listOf({ count: ROW_COUNT, scrollMargin: 0 }))

	await expect.poll(list.mounted).toEqual(["0", "1", "2", "3", "4", "5", "6"])
})

it("mounts nothing for an empty list", async () => {
	const list = await mountList(listOf({ count: 0 }))

	await expect.poll(list.mounted).toEqual([])
	await expect.element(list.list).toHaveStyle({ height: "0px" })
})

it("mounts fewer rows when the window gets shorter", async () => {
	const list = await mountList(listOf())
	await expect.poll(list.mounted).toEqual(["0", "1", "2", "3"])

	await resizeWindowTo(500)
	await expect.poll(list.mounted).toEqual(["0", "1"])

	await resizeWindowTo(VIEWPORT.height)
	await expect.poll(list.mounted).toEqual(["0", "1", "2", "3"])
})