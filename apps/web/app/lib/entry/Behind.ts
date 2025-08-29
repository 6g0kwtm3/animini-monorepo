import ReactRelay from "react-relay"

import type { Behind_entry$key } from "~/gql/Behind_entry.graphql"
import { readFragment } from "../Network"
const { graphql } = ReactRelay

/**
 * @RelayResolver MediaList.behind: Int
 * @rootFragment Behind_entry*/
export function behind(data: Behind_entry$key): null | number {
	const entry = readFragment(
		graphql`
			fragment Behind_entry on MediaList {
				id
				progress
				media {
					id
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
