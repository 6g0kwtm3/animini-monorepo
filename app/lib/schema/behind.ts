import type { FragmentType } from "~/gql";
import { graphql, useFragment as readFragment } from "~/gql";

export default function (data: FragmentType<typeof behind_data>) {
	const entry = readFragment(behind_data, data)

	return (
		((entry.media?.nextAiringEpisode?.episode - 1 ||
			entry.media?.episodes ||
			Number.POSITIVE_INFINITY) -
			(entry.progress ?? 0))
	)
}

const behind_data = graphql(`
	fragment behind on MediaList @component {
		progress
		media {
			episodes
			nextAiringEpisode {
				episode
			}
		}
	}
`)
