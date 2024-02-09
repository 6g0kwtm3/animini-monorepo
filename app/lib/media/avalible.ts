import { Predicate } from "effect"
import { MediaStatus } from "~/gql/graphql"
import type { FragmentType } from "~/lib/graphql"
import { useFragment as readFragment, graphql } from "~/lib/graphql"

import { serverOnly$ } from "vite-env-only"

const Avalible_media = serverOnly$(
	graphql(`
		fragment Avalible_media on Media {
			status
			episodes
			nextAiringEpisode {
				id
				episode
			}
			id
		}
	`)
)

export function avalible(data: FragmentType<typeof Avalible_media> | null) {
	const media = readFragment<typeof Avalible_media>(data)

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
