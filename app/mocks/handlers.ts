import { graphql, http, HttpResponse, passthrough } from "msw"

import type {
	rootQuery$rawResponse,
	rootQuery$variables,
} from "~/gql/rootQuery.graphql"

import * as jose from "jose"
import type {
	routeNavUserQuery$rawResponse,
	routeNavUserQuery$variables,
} from "~/gql/routeNavUserQuery.graphql"

import type {
	routeNavUserListEntriesQuery$rawResponse,
	routeNavUserListEntriesQuery$variables,
} from "~/gql/routeNavUserListEntriesQuery.graphql"
import type {
	routeNavUserListQuery$rawResponse,
	routeNavUserListQuery$variables,
} from "~/gql/routeNavUserListQuery.graphql"

function hashCode(str: string) {
	var hash = 0,
		i,
		chr
	if (str.length === 0) return hash
	for (i = 0; i < str.length; i++) {
		chr = str.charCodeAt(i)
		hash = (hash << 5) - hash + chr
		hash |= 0 // Convert to 32bit integer
	}
	return hash
}

export const handlers = [
	graphql.query<
		routeNavUserListQuery$rawResponse,
		routeNavUserListQuery$variables
	>("routeNavUserListQuery", ({ variables }) => {
		const user = {
			id: hashCode(variables.userName),
			avatar: null,
			bannerImage: null,
			mediaListOptions: null,
			name: variables.userName,
		}

		if (variables.type === "ANIME")
			return HttpResponse.json({
				data: {
					MediaListCollection: {
						lists: [{ name: "Watching" }],
						user: user,
					},
				},
			})

		return HttpResponse.json({
			data: {
				MediaListCollection: {
					lists: [{ name: "Reading" }],
					user: user,
				},
			},
		})
	}),

	graphql.query<
		routeNavUserListEntriesQuery$rawResponse,
		routeNavUserListEntriesQuery$variables
	>("routeNavUserListEntriesQuery", ({ variables }) => {
		const user = {
			id: hashCode(variables.userName),
			mediaListOptions: null,
		}
		if (variables.type === "ANIME")
			return HttpResponse.json({
				data: {
					MediaListCollection: {
						lists: [{ name: "Watching", entries: [] }],
						user: user,
					},
				},
			})

		return HttpResponse.json({
			data: {
				MediaListCollection: {
					lists: [{ name: "Reading", entries: [] }],
					user: user,
				},
			},
		})
	}),
	graphql.query<routeNavUserQuery$rawResponse, routeNavUserQuery$variables>(
		"routeNavUserQuery",
		({ variables }) => {
			return HttpResponse.json({
				data: {
					user: {
						id: hashCode(variables.userName),
						name: variables.userName,
						about: null,
						avatar: null,
						bannerImage: null,
						isFollowing: null,
						options: null,
					},
				},
			})
		}
	),
	graphql.query<rootQuery$rawResponse, rootQuery$variables>(
		"rootQuery",
		({ request }) => {
			const auth = request.headers.get("Authorization")?.replace("Bearer ", "")

			if (!auth)
				return HttpResponse.json({
					data: { Viewer: null },
				})

			const claims = jose.decodeJwt(auth)

			if (!claims.sub)
				return HttpResponse.json({
					data: { Viewer: null },
				})

			return HttpResponse.json({
				data: {
					Viewer: {
						id: hashCode(claims.sub),
						name: claims.sub,
						unreadNotificationCount: 0,
					},
				},
			})
		}
	),
	http.post("https://graphql.anilist.co/", () => HttpResponse.error()),
	http.get("*", () => passthrough()),
]
