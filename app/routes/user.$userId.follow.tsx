import { Schema } from "@effect/schema"
import type { ActionFunction } from "@remix-run/node"
import { useActionData } from "@remix-run/react"
import { graphql } from "~/gql"
import { Ariakit } from "~/lib/ariakit"
import { client_operation } from "~/lib/client"
import { m } from "~/lib/paraglide"

export const action = (async (args) => {
	const params = Schema.decodeUnknownSync(
		Schema.struct({
			userId: Schema.NumberFromString
		})
	)(args.params)

	const data = await client_operation(
		graphql(`
			mutation UserFollow($userId: Int!) {
				ToggleFollow(userId: $userId) {
					id
					name
					isFollowing
				}
			}
		`),
		{ userId: params.userId },
		args
	)

	if (!data?.ToggleFollow?.name) {
		throw new Error("Failed to follow")
	}

	return {
		...data,
		ToggleFollow: {
			...data.ToggleFollow,
			name: data.ToggleFollow.name
		}
	}
}) satisfies ActionFunction

export default function Page(): JSX.Element {
	const data = useActionData<typeof action>()

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
