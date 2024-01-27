import { graphql } from "~/lib/graphql.server"

export const ToWatch_entry = graphql(`
	fragment ToWatch_entry on MediaList {
		...Behind_entry
		media {
			duration
			id
		}
		id
	}
`)