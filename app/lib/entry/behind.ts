import type {} from "~/gql"
import { graphql } from "~/gql"
import { FragmentType, useFragment as readFragment } from "~/lib/graphql"
import { avalible } from "../media/avalible"

function Behind_entry() {
	return graphql(`
		fragment Behind_entry on MediaList {
			progress
			media {
				id
				...Avalible_media
			}
		}
	`)
}

export function behind(data: FragmentType<typeof Behind_entry>) {
	const entry = readFragment<typeof Behind_entry>(data)

	return (
		(avalible(entry.media) ?? entry.progress ?? Number.POSITIVE_INFINITY) -
		(entry.progress ?? 0)
	)
}
