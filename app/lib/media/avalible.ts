import { Predicate } from "effect"
import type { FragmentType } from "~/gql"
import { MediaStatus } from "~/gql/graphql"
import { useFragment as readFragment } from "~/lib/graphql"

import type { Avalible_media } from './avalible.server'
export function avalible(data: FragmentType<typeof Avalible_media> | null) {
	const media = readFragment<typeof Avalible_media>( data)

	if (media?.status == null) {
		return null
	}

	if (
		media.status === MediaStatus.Releasing ||
		media.status === MediaStatus.Finished ||
		media.status === MediaStatus.Cancelled
	) {
		return Predicate.isNumber(media.nextAiringEpisode?.episode)
			? media.nextAiringEpisode.episode - 1
			: media.episodes
	}

	if (media.status === MediaStatus.Hiatus) {
		return null
	}

	if (media.status === MediaStatus.NotYetReleased) {
		return 0
	}

	media.status satisfies never
	return null
}
