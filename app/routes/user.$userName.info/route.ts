import { Schema } from "@effect/schema"
import ReactRelay from "react-relay"

import type { routeUserInfoQuery } from "~/gql/routeUserInfoQuery.graphql"
import { client_operation } from "~/lib/client"
import type Route from "./+types.route"
const { graphql } = ReactRelay

export const clientLoader = async (args: Route.ClientLoaderArgs) => {
	const params = Schema.decodeUnknownSync(
		Schema.Struct({
			userName: Schema.String,
		})
	)(args.params)

	const data = await client_operation<routeUserInfoQuery>(
		graphql`
			query routeUserInfoQuery($userName: String!) @raw_response_type {
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
		`,
		{ userName: params.userName }
	)
	return data
}
