
import type { FragmentType } from "~/gql"
import { graphql, useFragment as readFragment } from "~/gql"


import { behind } from "./behind"

const ToWatch_entry = graphql(`
	fragment ToWatch_entry on MediaList {
		...Behind_entry
		media {
			duration
			id
		}
		id
	}
`)
export function toWatch(data: FragmentType<typeof ToWatch_entry>) {
	const entry = readFragment(ToWatch_entry, data)
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