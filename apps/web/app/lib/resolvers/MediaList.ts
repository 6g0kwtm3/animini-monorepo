import ReactRelay from "react-relay"

import { readFragment } from "../Network"

import type { Behind_entry$key } from "~/gql/Behind_entry.graphql"
const { graphql } = ReactRelay

/**
 * @relayField MediaList.behind: Int
 * @rootFragment Behind_entry
 */
export function behind(data: Behind_entry$key): null | number {
	const entry = readFragment(
		graphql`
			fragment Behind_entry on MediaList @throwOnFieldError {
				progress
				media {
					avalible @required(action: NONE)
				}
			}
		`,
		data
	)

	const avalible = entry.media?.avalible

	if (typeof avalible !== "number") {
		return null
	}

	return Math.max(0, avalible - (entry.progress ?? 0))
}

import type { ToWatch_entry$key } from "~/gql/ToWatch_entry.graphql"

/**
 * @relayField MediaList.toWatch: Int
 * @rootFragment ToWatch_entry
 */
export function toWatch(data: ToWatch_entry$key): null | number {
	const entry = readFragment(
		graphql`
			fragment ToWatch_entry on MediaList @throwOnFieldError {
				behind @required(action: NONE)
				media {
					duration
				}
			}
		`,
		data
	)

	if (!entry) {
		return null
	}

	return entry.behind * Math.max(3, (entry.media?.duration ?? 25) - 3)
}
