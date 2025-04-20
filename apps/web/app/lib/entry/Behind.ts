import ReactRelay from "react-relay"



import type { Behind_entry$key } from "~/gql/Behind_entry.graphql"
import { readFragment } from "../Network"
const { graphql } = ReactRelay

const Behind_entry = graphql`
	fragment Behind_entry on MediaList {
		id
		progress
		media {
			id
			avalible @required(action: NONE)
		}
	}
`

/**
 * @RelayResolver MediaList.behind: Int
 * @rootFragment Behind_entry*/
export function behind(data: Behind_entry$key): number | null {
	const entry = readFragment(Behind_entry, data)

	const avalible = entry.media?.avalible

	if (typeof avalible !== "number") {
		return null
	}

	return Math.max(0, avalible - (entry.progress ?? 0))
}
