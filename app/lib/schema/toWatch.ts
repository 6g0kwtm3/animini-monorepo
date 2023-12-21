import type { FragmentType } from "~/gql"
import { graphql, useFragment as readFragment } from "~/gql"

export function formatWatch(minutes: number) {
	if (!Number.isFinite(minutes)) {
		return ""
	}
	if (minutes > 60) {
		return Math.floor(minutes / 60) + "h " + (minutes % 60) + "min"
	}
	return minutes + "min"
}

export default function toWatch(data: FragmentType<typeof toWatch_data>) {
	({ data })
	const entry = readFragment(toWatch_data, data)

	const toWatch = entry.behind * ((entry.media?.duration ?? 25) - 3) || Number.POSITIVE_INFINITY

	return {
		raw: toWatch,
		string: formatWatch(toWatch),
	}
}

const toWatch_data = graphql(`
	fragment toWatch on MediaList @component {
		behind
		media {
			duration
		}
	}
`)
