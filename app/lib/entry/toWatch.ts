import type { FragmentType } from "~/lib/graphql"
import { graphql, readFragment } from "~/lib/graphql"

import { serverOnly$ } from "vite-env-only"
import { behind as getBehind } from "./behind"

const ToWatch_entry = serverOnly$(
	graphql(`
		fragment ToWatch_entry on MediaList {
			...Behind_entry
			media {
				duration
				id
			}
			id
		}
	`)
)

export type ToWatch_entry = typeof ToWatch_entry

export function toWatch(
	data: FragmentType<typeof ToWatch_entry>
): number | null {
	const entry = readFragment<typeof ToWatch_entry>(data)
	const behind = getBehind(entry)
	if (typeof behind !== "number") {
		return null
	}

	return behind * Math.max(3, (entry.media?.duration ?? 25) - 3)
}

export function formatWatch(minutes: number): string {
	if (!Number.isFinite(minutes)) {
		return ""
	}
	if (minutes > 60) {
		return `${Math.floor(minutes / 60)}h ${minutes % 60}min`
	}
	return `${minutes}min`
}
