import { Predicate } from "effect"
import { MediaStatus } from "~/gql/graphql"
import type { FragmentType } from "~/lib/graphql"
import { graphql, useFragment as readFragment } from "~/lib/graphql"

import { serverOnly$ } from "vite-env-only"

const Avalible_media = serverOnly$(
	graphql(`
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
		return media.nextAiringEpisode &&
			Predicate.isNumber(media.nextAiringEpisode.episode)
			? media.nextAiringEpisode.episode - 1
			: media.episodes ?? media.chapters
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
