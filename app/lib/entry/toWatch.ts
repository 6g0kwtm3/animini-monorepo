import type { FragmentType } from "~/gql"
import { useFragment as readFragment } from "~/lib/graphql"

import { behind } from "./behind"
import type { ToWatch_entry } from "./toWatch.server"

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
