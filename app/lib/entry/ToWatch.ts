import ReactRelay from "react-relay"
import type { ToWatch_entry$key } from "~/gql/ToWatch_entry.graphql"
import { readFragment } from "../Network"

const { graphql } = ReactRelay

const ToWatch_entry = graphql`
	fragment ToWatch_entry on MediaList {
		behind @required(action: NONE)
		media {
			duration
			id
		}
		id
	}
`

export type ToWatch_entry = typeof ToWatch_entry

/**
 * @RelayResolver MediaList.toWatch: Int
 * @rootFragment ToWatch_entry*/
export function toWatch(data: ToWatch_entry$key): number | null {
	const entry = readFragment(ToWatch_entry, data)

	if (!entry) {
		return null
	}

	return entry.behind * Math.max(3, (entry.media?.duration ?? 25) - 3)
}

export function formatWatch(minutes: number): string {
	if (!Number.isFinite(minutes)) {
		return ""
	}
	if (minutes > 60) {
		return `${Math.floor(minutes / 60)}h`
	}
	return `${minutes}min`
}
