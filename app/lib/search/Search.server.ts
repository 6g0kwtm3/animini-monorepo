import { graphql } from "~/lib/graphql.server"
export const SearchItem_media = graphql(`
	fragment SearchItem_media on Media {
		id
		type
		coverImage {
			medium
			extraLarge
		}
		title {
			userPreferred
		}
	}
`)