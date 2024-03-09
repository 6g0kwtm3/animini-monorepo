import { Schema } from "@effect/schema"
import type { LoaderFunction } from "@remix-run/node"
import { json } from "@remix-run/node"
import { graphql } from "~/gql"
import { client_operation } from "~/lib/client"

export const loader = (async (args) => {
	const params = Schema.decodeUnknownSync(
		Schema.struct({
			userName: Schema.string
		})
	)(args.params)

	const data = await client_operation(
		graphql(`
			query UserInfo($userName: String!) {
				User(name: $userName) {
					id
					isFollower
					isFollowing
					avatar {
						medium
						large
					}
					donatorBadge
				}
			}
		`),
		{ userName: params.userName },
		args
	)

	return json(data, {
		headers: {
			"Cache-Control": "max-age=15, stale-while-revalidate=45, private"
		}
	})
}) satisfies LoaderFunction
