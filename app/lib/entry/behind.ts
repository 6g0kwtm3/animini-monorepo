import type { FragmentType } from "~/gql"
import { useFragment as readFragment } from "~/lib/graphql"
import { avalible } from "../media/avalible"
import type { Behind_entry } from "./behind.server"

export function behind(data: FragmentType<typeof Behind_entry>) {
	const entry = readFragment<typeof Behind_entry>(data)

	return (
		(avalible(entry.media) ?? entry.progress ?? Number.POSITIVE_INFINITY) -
		(entry.progress ?? 0)
	)
}
