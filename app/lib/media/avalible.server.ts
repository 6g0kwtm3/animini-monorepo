import { graphql } from "~/lib/graphql.server"

export const Avalible_media = graphql(`
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
