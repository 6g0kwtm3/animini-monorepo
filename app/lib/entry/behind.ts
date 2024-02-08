import { graphql } from "~/gql"
import { useFragment as readFragment, type FragmentType } from "~/lib/graphql"
import { avalible } from "../media/avalible"
import { serverOnly$ } from "vite-env-only"

const  Behind_entry =  serverOnly$(graphql(`
		fragment Behind_entry on MediaList {
			progress
			media {
				id
				...Avalible_media
			}
		}
	`)
)

export function behind(data: FragmentType<typeof Behind_entry>) {
	const entry = readFragment<typeof Behind_entry>(data)

	return (
		(avalible(entry.media) ?? entry.progress ?? Number.POSITIVE_INFINITY) -
		(entry.progress ?? 0)
	)
}
