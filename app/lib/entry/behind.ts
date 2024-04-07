import { serverOnly$ } from "vite-env-only"
import { graphql } from "~/gql"
import { readFragment, type FragmentType } from "~/lib/graphql"
import { avalible as getAvalible } from "../media/avalible"

const Behind_entry = serverOnly$(
	graphql(`
		fragment Behind_entry on MediaList {
			progress
			media {
				id
				...Avalible_media
			}
		}
	`)
)

export function behind(data: FragmentType<typeof Behind_entry>): number | null {
	const entry = readFragment<typeof Behind_entry>(data)

	const avalible = getAvalible(entry.media)

	if (typeof avalible !== "number") {
		return null
	}

	return Math.max(0, avalible - (entry.progress ?? 0))
}
