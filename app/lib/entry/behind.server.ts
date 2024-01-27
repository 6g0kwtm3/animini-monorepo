import { graphql } from "~/lib/graphql.server"

export const Behind_entry = graphql(`
	fragment Behind_entry on MediaList {
		progress
		media {
			id
			...Avalible_media
		}
	}
`)