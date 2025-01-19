import { useActionData, type ClientActionFunction } from "react-router"
import { type } from "arktype"
import type { ReactNode } from "react"
import ReactRelay from "react-relay"
import type { routeUserFollowMutation } from "~/gql/routeUserFollowMutation.graphql"

import { Ariakit } from "~/lib/ariakit"

import { client_get_client } from "~/lib/client"
import { invariant } from "~/lib/invariant"
import { m } from "~/lib/paraglide"
const { graphql } = ReactRelay

const UserFollow = graphql`
	mutation routeUserFollowMutation($userId: Int!) {
		ToggleFollow(userId: $userId) {
			id
			name @required(action: LOG)
			isFollowing
		}
	}
`

const Params = type({
	userId: "string.integer.parse",
})
export const clientAction = (async (args) => {
	const params = invariant(Params(args.params))

	const client = client_get_client()

	const data = await client.mutation<routeUserFollowMutation>({
		mutation: UserFollow,
		variables: { userId: params.userId },
	})

	if (!data.ToggleFollow) {
		throw new Error("Failed to follow")
	}

	return { ToggleFollow: data.ToggleFollow }
}) satisfies ClientActionFunction

export default function Page(): ReactNode {
	const data = useActionData<typeof clientAction>()

	return (
		<main>
			{data ? (
				<Ariakit.Heading>
					{data.ToggleFollow.isFollowing
						? m.follow({ name: data.ToggleFollow.name })
						: m.unfollow({ name: data.ToggleFollow.name })}
				</Ariakit.Heading>
			) : (
				<Ariakit.Heading>Oops</Ariakit.Heading>
			)}
		</main>
	)
}
