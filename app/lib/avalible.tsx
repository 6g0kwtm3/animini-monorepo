import { Predicate } from "effect"
import type { FragmentType } from "~/gql"
import { graphql, useFragment as readFragment } from "~/gql"
import { MediaStatus } from "~/gql/graphql"
const Avalible_media = graphql(`
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

export function avalible(data: FragmentType<typeof Avalible_media> | null) {
	const media = readFragment(Avalible_media, data)

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
	
	media.status satisfies never;
	return null
}
