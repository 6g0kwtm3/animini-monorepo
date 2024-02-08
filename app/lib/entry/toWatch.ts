import type { FragmentType } from "~/lib/graphql"
import { useFragment as readFragment , graphql } from "~/lib/graphql"

import { behind } from "./behind"



function ToWatch_entry() {
	return graphql(`
		fragment ToWatch_entry on MediaList {
			...Behind_entry
			media {
				duration
				id
			}
			id
		}
	`)
}

export function toWatch(data: FragmentType<typeof ToWatch_entry>) {
	const entry = readFragment<typeof ToWatch_entry>(data)
	return behind(entry) * ((entry.media?.duration ?? 25) - 3)
}

export function formatWatch(minutes: number) {
	if (!Number.isFinite(minutes)) {
		return ""
	}
	if (minutes > 60) {
		return Math.floor(minutes / 60) + "h " + (minutes % 60) + "min"
	}
	return minutes + "min"
}
