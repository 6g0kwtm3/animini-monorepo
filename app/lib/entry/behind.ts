import type { FragmentType } from "~/gql"
import { graphql, useFragment as readFragment } from "~/gql"
import { avalible } from "../media/avalible"

const Behind_entry = graphql(`
	fragment Behind_entry on MediaList {
		progress
		media {
			id
			...Avalible_media
		}
	}
`)

export function behind(data: FragmentType<typeof Behind_entry>) {
	const entry = readFragment(Behind_entry, data)

	return (
		(avalible(entry.media) ?? entry.progress ?? Number.POSITIVE_INFINITY) -
		(entry.progress ?? 0)
	)
}
