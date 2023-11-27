import { graphql, useFragment, type FragmentType } from "~/gql"

const ToWatch_entry = graphql(`
	fragment ToWatch_entry on MediaList {
		...Behind_entry
		id
		media {
			duration
			id
		}
	}
`)

export function toWatch(data: FragmentType<typeof ToWatch_entry>) {
	const entry = useFragment(ToWatch_entry, data)
	return behind(entry) * ((entry.media?.duration ?? 25) - 3) || Infinity
}

const Behind_entry = graphql(`
	fragment Behind_entry on MediaList {
		progress
		media {
			episodes
			nextAiringEpisode {
				id
				episode
			}
			id
		}
	}
`)

export function behind(data: FragmentType<typeof Behind_entry>) {
	const entry = useFragment(Behind_entry, data)
	return (
		(Number(entry.media?.nextAiringEpisode?.episode) - 1 ||
			entry.media?.episodes ||
			Infinity) - (entry.progress ?? 0)
	)
}

export function formatWatch(minutes: number) {
	if (!isFinite(minutes)) {
		return ""
	}
	if (minutes > 60) {
		return Math.floor(minutes / 60) + "h " + (minutes % 60) + "min"
	}
	return minutes + "min"
}
