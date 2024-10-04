import { buildSchema, execute, parse, type DocumentNode } from "graphql"
import {
	graphql,
	http,
	HttpResponse,
	passthrough,
	type GraphQLHandler,
	type GraphQLQuery,
	type GraphQLVariables,
	type ResponseResolver,
} from "msw"
import type { TypedDocumentNode } from "msw/core/graphql"
import raw from "~/../schema.graphql?raw"
import {
	mockActivityLikeNotification,
	mockAiringNotification,
	mockList,
	mockRelatedMediaAdditionNotification,
	mockUser,
} from "./entities"

import { faker as en } from "@faker-js/faker/locale/en"
import { faker as ja } from "@faker-js/faker/locale/ja"
import {
	addMocksToSchema,
	createMockStore,
	type Ref,
} from "@graphql-tools/mock"
import type {
	rootQuery$rawResponse,
	rootQuery$variables,
} from "~/gql/rootQuery.graphql"
import type { Resolvers } from "./resolvers"

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

export function operation<Q, V>(resolver: any): any {
	return async (args: any) =>
		HttpResponse.json(
			await execute({
				document: parse(args.query),
				schema: schema,
				variableValues: args.variables,
				rootValue: resolver(args),
			})
		)
}

export function mock<Q, V>(): any {
	return async (args: any) =>
		HttpResponse.json(
			await execute({
				document: parse(args.query),
				schema: mocked,
				variableValues: args.variables,
			})
		)
}

export function query(operationName: any, resolver: any): GraphQLHandler {
	return graphql.query(operationName, operation(resolver))
}

export function mutation<Q extends GraphQLQuery, V extends GraphQLVariables>(
	operationName: any | DocumentNode | TypedDocumentNode<Q, V>,
	resolver: ResponseResolver<any, null, any>
): GraphQLHandler {
	return graphql.mutation(operationName, operation(resolver))
}

export const routeNavNotificationsQuery_read = query(
	"routeNavNotificationsQuery",
	() => ({
		Viewer: mockUser({
			id: 0,
			unreadNotificationCount: 0,
		}),
		Page: {
			notifications(args: any) {
				return mockList(
					0,
					mockAiringNotification({}),
					mockRelatedMediaAdditionNotification({}),
					mockActivityLikeNotification({})
				)
			},
		},
	})
)

export const routeNavNotificationsQuery_unread = query(
	"routeNavNotificationsQuery",
	() => ({
		Viewer: mockUser({ id: 0 }),
		Page: {
			notifications(args: any) {
				return mockList(
					0,
					mockAiringNotification({}),
					mockRelatedMediaAdditionNotification({}),
					mockActivityLikeNotification({})
				)
			},
		},
	})
)

export const routeNavLoginQuery_success = query("routeNavLoginQuery", () => ({
	Viewer: mockUser({ id: 0 }),
}))

export const routeNavLoginQuery_error = query("routeNavLoginQuery", () => null)

export const routeNavNotificationsQuery_empty = query(
	"routeNavNotificationsQuery",
	() => ({
		Viewer: mockUser({ id: 0 }),
		Page: {
			notifications: [],
		},
	})
)

export const routeNavFeedQuery = query("routeNavNotificationsQuery", () => ({
	Viewer: mockUser({ id: 0 }),
	Page: {
		notifications: [],
	},
}))

let schema = buildSchema(raw)

const store = createMockStore({
	schema,
	mocks: {
		Int: () => en.number.int({ max: 256 }),
		Float: () => en.number.float({ fractionDigits: 2 }),
	},
	typePolicies: {
		User: { keyFieldName: "name" },
	},
})

const mocked = addMocksToSchema<Resolvers>({
	schema,
	store,
	resolvers: {
		User: {
			name: () => en.internet.userName(),
			avatar: () => {
				const url = en.image.avatar()
				return {
					medium: url,
					large: url,
				}
			},
			bannerImage: () => {
				return en.image.url({ width: 1900, height: 400 })
			},
		},
		MediaListGroup: {
			name: () => en.lorem.words(2),
		},
		MediaList: {
			media: (_: Ref) => {
				return store.get("Media", Number(store.get(_, "mediaId")))
			},
			score: (_: Ref, args) => {
				const score = Number(store.get(_, "score"))

				args.format ??= store.get<any>("User", store.get(_, "userId"), [
					"mediaListOptions",
					"scoreFormat",
				])

				if (args.format == "POINT_100") {
					return Math.round(score * 100)
				}
				if (args.format == "POINT_10_DECIMAL") {
					return Number((score * 10).toFixed(1))
				}
				if (args.format == "POINT_10") {
					return Math.round(score * 10)
				}
				if (args.format == "POINT_5") {
					return Math.round(score * 5)
				}
				if (args.format == "POINT_3") {
					return Math.round(score * 3)
				}
			},
		},

		Media: {
			description: () => en.lorem.sentences(3),
			nextAiringEpisode: (_: Ref) => {
				return {
					episode: en.number.int(Number(store.get(_, "episodes"))),
				}
			},
			coverImage: () => {
				const url = en.image.urlPicsumPhotos({
					height: 660,
					width: 440,
				})

				return {
					medium: url,
					large: url,
					extraLarge: url,
				}
			},
			bannerImage: () => {
				return en.image.url({ width: 1900, height: 400 })
			},
		},
		MediaCoverImage: {
			color: () => en.color.rgb(),
		},
		Staff: {
			name: () => ja.person.fullName(),
		},
		Page: {
			notifications: (_: Ref, args) => {
				if (args.resetNotificationCount) {
					store.set("Query", "ROOT", "Viewer", { unreadNotificationCount: 0 })
				}
				const unreadNotificationCount = store.get("Query", "ROOT", [
					"Viewer",
					"unreadNotificationCount",
				])
				return Array.from(
					{ length: Number(unreadNotificationCount) || 0 },
					(_, i) => null
				)
			},
		},
		Query: {
			Media: (_: Ref, { id }) => store.get("Media", id),
			MediaListCollection: (_: Ref, { userName, type }) =>
				store.get("MediaListCollection", userName),
			// Viewer: () => ({}),
			User: (_: Ref, { name }) => {
				return store.get("User", name)
			},
		},

		// MediaListCollection: {
		// 	lists: (_: Ref) => {},
		// },

		Mutation: {
			SaveMediaListEntry(_: Ref, { id, ...args }) {
				for (const [key, value] of Object.entries(args)) {
					store.set("MediaList", id, key, value)
				}
				return store.get("MediaList", id)
			},
		},
	},
})

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
	graphql.operation<any, any>(async ({ query, variables }) => {
		return HttpResponse.json(
			await execute({
				document: parse(query),
				schema: mocked,
				variableValues: variables,
			})
		)
	}),
	http.post("https://graphql.anilist.co/", () => HttpResponse.error()),
	http.get("*", () => passthrough()),
]
