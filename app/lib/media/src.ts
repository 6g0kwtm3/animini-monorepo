import ReactRelay from "react-relay"
import type { src_mediaCover$key } from "~/gql/src_mediaCover.graphql"
import { readFragment } from "../Network"

const { graphql } = ReactRelay

const src_mediaCover = graphql`
	fragment src_mediaCover on MediaCoverImage
	@argumentDefinitions(
		large: { type: "Boolean", defaultValue: true }
		extraLarge: { type: "Boolean", defaultValue: true }
	) {
		extraLarge @include(if: $extraLarge)
		large @include(if: $large)
		medium
	}
`

/**
 * @RelayResolver MediaCoverImage.src: String
 * @rootFragment src_mediaCover*/
export function src(key: src_mediaCover$key): string | null {
	const data = readFragment(src_mediaCover, key)

	return data.extraLarge ?? data.large ?? data.medium ?? null
}
