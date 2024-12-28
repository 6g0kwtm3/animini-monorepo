import type { ReactNode } from "react"
import ReactRelay from "react-relay"
import { type ClientActionFunction } from "react-router"
import type { routeUserFollowMutation } from "~/gql/routeUserFollowMutation.graphql"

import { type } from "arktype"
import { Ariakit } from "~/lib/ariakit"
import { invariant } from "~/lib/invariant"
import { mutation } from "~/lib/Network"
import { m } from "~/lib/paraglide"
import type { Route } from "./+types/route"
const { graphql } = ReactRelay

const UserFollow = graphql`
	mutation routeUserFollowMutation($userId: Int!) @raw_response_type {
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

 

	const data = await mutation<routeUserFollowMutation>({
		mutation: UserFollow,
		variables: { userId: params.userId },
	})

	if (!data.ToggleFollow) {
		throw new Error("Failed to follow")
	}

	return { ToggleFollow: data.ToggleFollow }
}) satisfies ClientActionFunction

export default function Page({
	actionData: data,
}: Route.ComponentProps): ReactNode {
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
