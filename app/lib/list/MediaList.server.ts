import { graphql } from "~/lib/graphql.server"

export const MediaList_group = graphql(`
	fragment MediaList_group on MediaListGroup {
		name
		entries {
			id
			...ToWatch_entry
			...ListItem_entry
			media {
				id
				status
				format
			}
		}
	}
`)
