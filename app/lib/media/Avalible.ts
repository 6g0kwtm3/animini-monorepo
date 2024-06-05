import ReactRelay from "react-relay"
import type {
	Avalible_media$key,
	MediaStatus
} from "~/gql/Avalible_media.graphql"
import { readFragment } from "../Network"
const { graphql } = ReactRelay

const Avalible_media = graphql`
	fragment Avalible_media on Media {
		status(version: 2)
		episodes
		chapters
		nextAiringEpisode {
			id
			episode
		}
		id
	}
`

/**
 * @RelayResolver Media.avalible: Int
 * @rootFragment Avalible_media*/
export function avalible(key: Avalible_media$key): number | null | undefined {
	const media = readFragment(Avalible_media, key)

	if (media.status == null) {
		return null
	}

	if (
		media.status === ("FINISHED" satisfies MediaStatus) ||
		media.status === ("CANCELLED" satisfies MediaStatus)
	) {
		return media.episodes ?? media.chapters
	}

	if (
		media.status === ("RELEASING" satisfies MediaStatus) ||
		media.status === ("HIATUS" satisfies MediaStatus)
	) {
		return typeof media.nextAiringEpisode?.episode === "number"
			? media.nextAiringEpisode.episode - 1
			: null
	}

	if (media.status === ("NOT_YET_RELEASED" satisfies MediaStatus)) {
		return 0
	}

	media.status satisfies "%future added value"
	return null
}
