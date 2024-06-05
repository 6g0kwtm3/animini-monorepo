import { Schema } from "@effect/schema"
import { unstable_defineClientLoader } from "@remix-run/react"
import ReactRelay from "react-relay"
import type { routeUserInfoQuery } from "~/gql/routeUserInfoQuery.graphql"
import { client_operation } from "~/lib/client"
const { graphql } = ReactRelay

export const clientLoader = unstable_defineClientLoader(async (args) => {
	const params = Schema.decodeUnknownSync(
		Schema.Struct({
			userName: Schema.String
		})
	)(args.params)

	const data = await client_operation<routeUserInfoQuery>(
		graphql`
			query routeUserInfoQuery($userName: String!) {
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
})
