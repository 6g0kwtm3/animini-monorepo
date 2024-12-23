import { unstable_defineClientLoader } from "@remix-run/react"
import { ArkErrors, type } from "arktype"
import ReactRelay from "react-relay"
import type { routeUserInfoQuery } from "~/gql/routeUserInfoQuery.graphql"
import { client_operation } from "~/lib/client"
import { invariant } from "~/lib/invariant"
const { graphql } = ReactRelay

const Params = type({
	userName: "string",
})
export const clientLoader = unstable_defineClientLoader(async (args) => {
	const params = invariant(Params(args.params)
) 

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
