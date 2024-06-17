import { buildSchema, execute, parse } from "graphql"
import { graphql, HttpResponse } from "msw"
import raw from "~/../schema.graphql?raw"

const schema = buildSchema(raw)

export const handlers = [
	graphql.operation<any, any>(async ({ query, variables }) => {
		return HttpResponse.json(
			await execute({
				document: parse(query),
				schema,
				variableValues: variables,
				rootValue: {
					Viewer(args: any) {
						return {
							id: 1,
							name: "John Doe",
							unreadNotificationCount: 100,
						}
					},
					Page(args: any) {
						return {
							media(args: any) {},
						}
					},
				},
			})
		)
	}),
]
