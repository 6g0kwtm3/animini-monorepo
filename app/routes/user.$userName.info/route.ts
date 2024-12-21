import { Schema } from "@effect/schema"
import ReactRelay from "react-relay"

import type { routeUserInfoQuery } from "~/gql/routeUserInfoQuery.graphql"
import type { Route } from "./+types/route"
import { fetchQuery } from "~/lib/Network"
const { graphql } = ReactRelay

export const clientLoader = async (args: Route.ClientLoaderArgs) => {
	const params = Schema.decodeUnknownSync(
		Schema.Struct({
			userName: Schema.String,
		})
	)(args.params)

	const data = await fetchQuery<routeUserInfoQuery>(
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
