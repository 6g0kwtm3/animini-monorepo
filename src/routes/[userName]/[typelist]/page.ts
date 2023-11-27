import { graphql } from "~/gql";

export const TypelistQuery = graphql(`
	query TypelistQuery($userName: String!, $type: MediaType!) {
		User(name: $userName) {
			id
			mediaListOptions {
				animeList {
					sectionOrder
				}
			}
		}
		MediaListCollection(userName: $userName, type: $type) {
			lists {
				name
				...MediaList_group
				entries {
					id
					media {
						id
						status
					}
				}
			}
		}
	}
`)