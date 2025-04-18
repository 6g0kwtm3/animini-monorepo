import type { ClientLoaderFunctionArgs } from "react-router"

import type { ReactNode } from "react"
import ReactRelay from "react-relay"
import {
	Form,
	Link,
	useFetcher,
	useLocation,
	useRouteLoaderData,
} from "react-router"
import { Button, Button as ButtonText } from "~/components/Button"
import { LayoutBody, LayoutPane } from "~/components/Layout"

import { button } from "~/lib/button"
import { client_operation } from "~/lib/client"
import { useRawLoaderData } from "~/lib/data"
import type { clientLoader as rootLoader } from "~/root"

import { type } from "arktype"
import type { routeNavUserQuery as NavUserQuery } from "~/gql/routeNavUserQuery.graphql"
import { invariant } from "~/lib/invariant"
import { m } from "~/lib/paraglide"
import type { clientAction as userFollowAction } from "../UserFollow/route"
const { graphql } = ReactRelay

export const clientLoader = async (args: ClientLoaderFunctionArgs) => {
	const { userName } = invariant(Params(args.params))

	const data = await client_operation<NavUserQuery>(
		graphql`
			query routeNavUserQuery($userName: String!) {
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
		throw Response.json("User not found", { status: 404 })
	}

	return { user: data.User }
}

import { numberToString } from "~/lib/numberToString"
import { Route } from "./+types/route"

const Params = type({ userName: "string" })

export default function Page({ params }: Route.ComponentProps): ReactNode {
	const rootData = useRouteLoaderData<typeof rootLoader>("root")
	const data = useRawLoaderData<typeof clientLoader>()

	const { pathname } = useLocation()

	const follow = useFetcher<typeof userFollowAction>({
		key: `${data.user.name}-follow`,
	})

	return (
		<LayoutBody>
			<title>{params.userName}&apos;s profile</title>

			<LayoutPane>
				<nav>
					<Link to="animelist" className={button()}>
						Anime List
					</Link>
					<Link to="mangalist" className={button()}>
						Manga List
					</Link>
				</nav>

				{rootData?.Viewer?.name && rootData.Viewer.name !== data.user.name && (
					<follow.Form
						method="post"
						action={`/user/${numberToString(data.user.id)}/follow`}
					>
						<input
							type="hidden"
							name="isFollowing"
							value={
								(follow.formData?.get("isFollowing")
								?? follow.data?.ToggleFollow.isFollowing
								?? data.user.isFollowing)
									? ""
									: "true"
							}
							id=""
						/>

						<Button type="submit" aria-disabled={!data.user.id}>
							{(follow.formData?.get("isFollowing")
							?? follow.data?.ToggleFollow.isFollowing
							?? data.user.isFollowing)
								? m.unfollow_button()
								: m.follow_button()}
						</Button>
					</follow.Form>
				)}

				{rootData?.Viewer?.name === data.user.name && (
					<Form
						method="post"
						action={`/logout/?${new URLSearchParams({ redirect: pathname })}`}
					>
						<ButtonText type="submit">Logout</ButtonText>
					</Form>
				)}
			</LayoutPane>
		</LayoutBody>
	)
}
