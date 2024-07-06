import { Schema } from "@effect/schema"
import type { MetaFunction } from "@remix-run/node"
import { json } from "@remix-run/node"

import {
	Form,
	Link,
	unstable_defineClientLoader,
	useFetcher,
	useLocation,
	useRouteLoaderData,
} from "@remix-run/react"
import type { ReactNode } from "react"
import ReactRelay from "react-relay"
import { Button, Button as ButtonText } from "~/components/Button"

import { button } from "~/lib/button"
import { client_operation } from "~/lib/client"
import { useRawLoaderData } from "~/lib/data"
import type { clientLoader as rootLoader } from "~/root"

import type { routeNavUserIndexQuery as NavUserQuery } from "~/gql/routeNavUserIndexQuery.graphql"
import { m } from "~/lib/paraglide"
import type { clientAction as userFollowAction } from "../user.$userId.follow/route"
const { graphql } = ReactRelay

export const clientLoader = unstable_defineClientLoader(async (args) => {
	const { userName } = Schema.decodeUnknownSync(params())(args.params)

	const data = await client_operation<NavUserQuery>(
		graphql`
			query routeNavUserIndexQuery($userName: String!) {
				User(name: $userName) {
					id
					name
					isFollowing
				}
			}
		`,
		{ userName }
	)

	if (!data?.User) {
		throw json("User not found", {
			status: 404,
		})
	}

	return { user: data.User }
})

export const meta = (({ params }) => {
	return [
		{
			title: `${params.userName}'s profile`,
		},
	]
}) satisfies MetaFunction<typeof clientLoader>

function params() {
	return Schema.Struct({
		userName: Schema.String,
	})
}

export default function Page(): ReactNode {
	const rootData = useRouteLoaderData<typeof rootLoader>("root")
	const data = useRawLoaderData<typeof clientLoader>()

	const { pathname } = useLocation()

	const follow = useFetcher<typeof userFollowAction>({
		key: `${data.user.name}-follow`,
	})

	return (
		<>
			<nav>
				<Link to="animelist" className={button()}>
					Anime List
				</Link>
				<Link to="mangalist" className={button()}>
					Manga List
				</Link>
			</nav>

			{rootData?.Viewer?.name && rootData.Viewer.name !== data.user.name && (
				<follow.Form method="post" action={`/user/${data.user.id}/follow`}>
					<input
						type="hidden"
						name="isFollowing"
						value={
							follow.formData?.get("isFollowing") ??
							follow.data?.ToggleFollow.isFollowing ??
							data.user.isFollowing
								? ""
								: "true"
						}
						id=""
					/>

					<Button type="submit" aria-disabled={!data.user.id}>
						{follow.formData?.get("isFollowing") ??
						follow.data?.ToggleFollow.isFollowing ??
						data.user.isFollowing
							? m.unfollow_button()
							: m.follow_button()}
					</Button>
				</follow.Form>
			)}

			{rootData?.Viewer?.name === data.user.name && (
				<Form
					method="post"
					action={`/logout/?${new URLSearchParams({
						redirect: pathname,
					})}`}
				>
					<ButtonText type="submit">Logout</ButtonText>
				</Form>
			)}
		</>
	)
}
