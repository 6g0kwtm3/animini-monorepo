import ReactRelay from "react-relay"

import type { routeUserInfoQuery } from "~/gql/routeUserInfoQuery.graphql"
import { fetchQuery } from "~/lib/Network"
import type { Route } from "./+types/route"
import { type } from "arktype"
import { invariant } from "~/lib/invariant"
const { graphql } = ReactRelay

const Params = type({
	userId: "string.integer.parse",
})

export const clientLoader = async (args: Route.ClientLoaderArgs) => {
	const params = invariant(Params(args.params))

	const data = await fetchQuery<routeUserInfoQuery>(
		graphql`
			query routeUserInfoQuery($id: Int!) @raw_response_type {
				User(id: $id) {
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
		{ id: params.userId }
	)
	return data
}
