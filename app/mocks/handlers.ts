import { buildSchema, execute, parse, type DocumentNode } from "graphql"
import {
	graphql,
	http,
	HttpResponse,
	passthrough,
	type GraphQLHandler,
	type GraphQLQuery,
	type GraphQLResponseResolver,
	type GraphQLVariables,
	type ResponseResolver,
} from "msw"
import type { TypedDocumentNode } from "msw/core/graphql"
import raw from "~/../schema.graphql?raw"
import {
	mockActivityLikeNotification,
	mockAiringNotification,
	mockList,
	mockMediaListCollection,
	mockRelatedMediaAdditionNotification,
	mockUser,
} from "./entities"

import { faker as en } from "@faker-js/faker/locale/en"
import { faker as ja } from "@faker-js/faker/locale/ja"
import { addMocksToSchema, type Ref } from "@graphql-tools/mock"

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

const mocked = addMocksToSchema({
	schema,
	mocks: {
		Int: () => en.number.int({ max: 256 }),
		Float: () => en.number.float({ fractionDigits: 2 }),
	},

	resolvers: (store): any => ({
		User: {
			name: () => en.internet.userName(),
			avatar: () => {
				const url = en.image.avatar()
				return {
					medium: url,
					large: url,
				}
			},
		},
		MediaListGroup: {
			name: () => en.lorem.words(2),
		},
		MediaList: {
			media: (_: Ref) => {
				return store.get("Media", Number(store.get(_, "mediaId")))
			},
			score: (_: Ref, args: any) => {
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
			notifications: (_: Ref, args: any) => {
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
			Media: (_: Ref, { id }: any) => store.get("Media", id),
			MediaListCollection: (_: Ref, { userName, type }: any) =>
				store.get("MediaListCollection", userName),
			// Viewer: () => ({}),
		},

		// MediaListCollection: {
		// 	lists: (_: Ref) => {},
		// },

		Mutation: {
			SaveMediaListEntry(_: Ref, { id, ...args }: any) {
				for (const [key, value] of Object.entries(args)) {
					store.set("MediaList", id, key, value)
				}
				return store.get("MediaList", id)
			},
		},
	}),
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
	graphql.operation<any, any>(async ({ query, variables }) => {
		return HttpResponse.json(
			await execute({
				document: parse(query),
				schema,
				variableValues: variables,
				rootValue: {
					MediaListCollection(args: any) {
						en.seed(hashCode(args.userName + ":" + args.type))
						return mockMediaListCollection(args)
					},
				},
				// rootValue: {
				// 	Viewer(args: any) {
				// 		return Option.getOrNull(Viewer())
				// 	},
				// 	Media(args: any) {
				// 		return args.id
				// 			? mockSeasonalMedia({
				// 					id: args.id,
				// 				})
				// 			: null
				// 	},
				// 	Page(args: any) {
				// 		return {
				// 			activities: mockList(0, mockTextActivity()),
				// 			notifications: [],
				// 			media(args: any) {
				// 				if (args.search) {
				// 					return mockList(
				// 						256,
				// 						mockMedia({
				// 							title: {
				// 								userPreferred: args.search,
				// 							},
				// 							type: "MANGA",
				// 						}),
				// 						mockSeasonalMedia({
				// 							title: {
				// 								userPreferred: args.search,
				// 							},
				// 						})
				// 					)
				// 				}

				// 				return mockList(
				// 					0,
				// 					mockMedia({
				// 						title: {
				// 							userPreferred: "Foo",
				// 						},
				// 					}),
				// 					mockMedia({
				// 						title: {
				// 							userPreferred: "Bar",
				// 						},
				// 					})
				// 				)
				// 			},
				// 		}
				// 	},
				// },
			})
		)
	}),
	http.post("https://graphql.anilist.co/", () => HttpResponse.error()),
	http.get("*", () => passthrough()),
]
