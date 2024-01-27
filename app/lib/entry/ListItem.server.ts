export const Progress_entry = graphql(`
	fragment Progress_entry on MediaList {
		id
		progress
		media {
			...Avalible_media
			id
			episodes
		}
	}
`)
import { graphql } from "~/lib/graphql.server"
export const ListItem_entry = graphql(`
	fragment ListItem_entry on MediaList {
		...ToWatch_entry
		...Progress_entry
		score
		progress
		media {
			id
			title {
				userPreferred
			}
			coverImage {
				extraLarge
				medium
			}
		}
	}
`)
