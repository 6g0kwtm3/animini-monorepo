import ReactRelay from "react-relay"
import type { srcset_mediaCover$key } from "~/gql/srcset_mediaCover.graphql"
import { readFragment } from "../Network"

const { graphql } = ReactRelay

const srcset_mediaCover = graphql`
	fragment srcset_mediaCover on MediaCoverImage 	@argumentDefinitions(
		large: { type: "Boolean", defaultValue: true }
		extraLarge: { type: "Boolean", defaultValue: true }
	)  {
		extraLarge @include(if: $extraLarge)
		large  @include(if: $large)
		medium
	}
`

/**
 * @RelayResolver MediaCoverImage.srcset: String
 * @rootFragment srcset_mediaCover*/
export function srcset(key: srcset_mediaCover$key): string | null {
	const data = readFragment(srcset_mediaCover, key)

	const entries = [
		[1, data.medium],
		[2.3, data.large],
		[4.6, data.extraLarge],
	] as const

	const filtered = entries.flatMap(([scale, src]): [number, string][] =>
		src ? [[scale, src]] : []
	)

	for (const entry of filtered) {
		entry[0] /= filtered[0]![0]
	}

	const normalized = filtered.map(([scale, src]) => [` ${scale}x`, src])

	if (!normalized[0]) return null

	normalized[0][0] = ""

	return normalized.map(([scale, src]) => `${src}${scale}`).join(", ")
}
