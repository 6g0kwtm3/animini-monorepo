import ReactRelay from "react-relay"
import { readInlineData } from "~/lib/Network"

import type { isVisible_entry$key } from "~/gql/isVisible_entry.graphql"
const { graphql } = ReactRelay

export const isVisible_entry = graphql`
	fragment isVisible_entry on MediaList @inline {
		id
		progress
		media {
			id
			status(version: 2)
			format
		}
		toWatch
	}
`

export function isVisible(
	data: isVisible_entry$key,
	searchParams: URLSearchParams
): boolean {
	let entry = readInlineData(isVisible_entry, data)

	const status = searchParams.getAll("status")
	const format = searchParams.getAll("format")
	const progresses = searchParams.getAll("progress")

	return (
		(status.length ? status.includes(entry.media?.status ?? "") : true) &&
		(format.length ? format.includes(entry.media?.format ?? "") : true) &&
		(progresses.includes("UNSEEN") ? (entry.toWatch ?? 1) > 0 : true) &&
		(progresses.includes("STARTED") ? (entry.progress ?? 0) > 0 : true)
	)
}
