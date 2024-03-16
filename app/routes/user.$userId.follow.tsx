import { Schema } from "@effect/schema"
import type { ActionFunction } from "@remix-run/cloudflare"
import { useActionData, type ClientActionFunction } from "@remix-run/react"
import type { ReactNode } from "react"
import { graphql } from "~/gql"
import { Ariakit } from "~/lib/ariakit"
import { client } from "~/lib/cache.client"

import { client_operation, type AnyActionFunctionArgs } from "~/lib/client"
import { m } from "~/lib/paraglide"

export const action = (async (args) => {
	return await follow(args)
}) satisfies ActionFunction

export const clientAction = (async (args) => {
	const data = await follow(args)
	client.invalidateQueries()
	return data
}) satisfies ClientActionFunction

async function follow(args: AnyActionFunctionArgs) {
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
}

export default function Page(): ReactNode {
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
