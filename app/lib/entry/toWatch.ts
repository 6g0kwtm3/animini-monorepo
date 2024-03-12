import type { FragmentType } from "~/lib/graphql"
import { graphql, useFragment as readFragment } from "~/lib/graphql"

import { serverOnly$ } from "vite-env-only"
import { behind } from "./behind"

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

export function toWatch(data: FragmentType<typeof ToWatch_entry>): number {
	const entry = readFragment<typeof ToWatch_entry>(data)
	return Math.max(0, behind(entry) * (entry.media?.duration ?? 25) - 3)
}

export function formatWatch(minutes: number): string {
	if (!Number.isFinite(minutes)) {
		return ""
	}
	if (minutes > 60) {
		return Math.floor(minutes / 60) + "h " + (minutes % 60) + "min"
	}
	return minutes + "min"
}
