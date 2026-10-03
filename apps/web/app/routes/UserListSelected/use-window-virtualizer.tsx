import type { Stable } from "@animedes/react-stable"
import {
	useCallback,
	use,
	useDebugValue,
	useDeferredValue,
	useMemo,
	useState,
	useSyncExternalStore,
	useTransition,
	useEffect,
	type Ref,
} from "react"
import { browser } from "react-dom"
import { useSyncExternalStoreWithSelector } from "use-sync-external-store/with-selector"

function onScrollOrResize(onChange: () => void) {
	const controller = new AbortController()
	window.addEventListener(
		"resize",
		() => {
			onChange()
		},
		{ signal: controller.signal }
	)
	window.addEventListener(
		"scroll",
		() => {
			onChange()
		},
		{ signal: controller.signal }
	)
	return () => {
		controller.abort()
	}
}

function identity<T>(x: T): T {
	return x
}

function isEqual(
	a: { start: number; end: number },
	b: { start: number; end: number }
) {
	return a.start === b.start && a.end === b.end
}

export function useWindowVirtualizer(props: {
	readonly count: number
	readonly estimateSize: Stable<(index: number) => number>
	readonly scrollMargin: number
	readonly overscan: number
	readonly gap: number
}) {
	const { count: numItems, estimateSize, scrollMargin, overscan, gap } = props

	const itemSizes = useMemo(() => {
		let offset = 0
		const itemSizes = Array.from({ length: numItems }, (_, i) => {
			const start = offset
			const size = estimateSize(i)
			offset += size + gap

			return { index: i, end: offset, start }
		})
		const last = itemSizes.at(-1)
		if (last !== undefined) {
			last.end -= gap
		}
		return itemSizes
	}, [estimateSize, numItems])

	const innerHeight =
		(itemSizes.at(-1)?.end ?? 0) - (itemSizes.at(0)?.start ?? 0)

	const { start, end } = useSyncExternalStoreWithSelector(
		onScrollOrResize,
		useCallback(
			() =>
				findVisibleRange(
					itemSizes,
					window.scrollY - scrollMargin,
					window.innerHeight
				),
			[itemSizes, scrollMargin]
		),
		null,
		identity,
		isEqual
	)

	const items = useMemo(() => {
		return itemSizes.slice(Math.max(0, start - overscan), end + overscan)
	}, [itemSizes, start, end, overscan])

	const newLocal = {
		virtualItems: items,
		totalSize: innerHeight,
		virtualizer: { options: props, measureElement: undefined },
	}
	useDebugValue(newLocal)
	return newLocal
}

function findVisibleRange(
	items: { start: number; end: number }[],
	scrollTop: number,
	windowHeight: number
) {
	const viewportBottom = scrollTop + windowHeight

	// First item whose bottom is > scrollTop
	let low = 0
	let high = items.length - 1
	let start = items.length

	while (low <= high) {
		const mid = (low + high) >> 1

		if (items[mid] === undefined) {
			throw new Error(`Unexpected`)
		}

		if (items[mid].end > scrollTop) {
			start = mid
			high = mid - 1
		} else {
			low = mid + 1
		}
	}

	// First item whose top is >= viewportBottom
	low = start
	high = items.length - 1
	let end = start

	while (low <= high) {
		const mid = (low + high) >> 1

		if (items[mid] === undefined) {
			throw new Error(`Unexpected`)
		}

		if (items[mid].start < viewportBottom) {
			end = mid + 1
			low = mid + 1
		} else {
			high = mid - 1
		}
	}

	return { start, end } // items.slice(start, end)
}
