import ReactRelay from "react-relay"
import type { Theme_mediaCover$key } from "~/gql/Theme_mediaCover.graphql"
import { readFragment } from "../Network"
import { getThemeFromHex, type Theme } from "../theme"
const { graphql } = ReactRelay

const Theme_mediaCover = graphql`
	fragment Theme_mediaCover on MediaCoverImage {
		color
	}
`

/**
 * @RelayResolver MediaCoverImage.theme: RelayResolverValue
 * @rootFragment Theme_mediaCover*/
export function theme(
	key: Theme_mediaCover$key
): Theme | null {
	const media = readFragment(Theme_mediaCover, key)

	return media.color ? getThemeFromHex(media.color) : null
}
