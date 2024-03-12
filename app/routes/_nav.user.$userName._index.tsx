import { Schema } from "@effect/schema"
import type {
	HeadersFunction,
	LoaderFunction,
	MetaFunction
} from "@vercel/remix"
import { json } from "@vercel/remix"

import {
	Form,
	Link,
	useFetcher,
	useLocation,
	type ClientLoaderFunction
} from "@remix-run/react"
import { Predicate } from "effect"
import type { ReactNode } from "react"
import { clientOnly$ } from "vite-env-only"
import { Button, Button as ButtonText } from "~/components/Button"
import { LayoutBody, LayoutPane } from "~/components/Layout"
import { graphql } from "~/gql"
import { button } from "~/lib/button"
import { LoaderCache } from "~/lib/cache.client"
import { client_operation } from "~/lib/client"
import { useRawLoaderData, useRawRouteLoaderData } from "~/lib/data"
import { getCacheControl } from "~/lib/getCacheControl"
import type { loader as rootLoader } from "~/root"

import { m } from "~/lib/paraglide"
import type { action as userFollowAction } from "./user.$userId.follow"

export const loader = (async (args) => {
	const { userName } = Schema.decodeUnknownSync(params())(args.params)

	const data = await client_operation(
		graphql(`
			query UserQuery($userName: String!) {
				User(name: $userName) {
					id
					name
					isFollowing
				}
			}
		`),
		{ userName },
		args
	)

	if (!data?.User) {
		throw new Response("User not found", {
			status: 404
		})
	}

	return json(
		{ user: data.User },
		{
			headers: {
				"Cache-Control": getCacheControl(cacheControl)
			}
		}
	)
}) satisfies LoaderFunction

const cacheControl = {
	maxAge: 15,
	staleWhileRevalidate: 45,
	private: true
}
const cache = clientOnly$(
	new LoaderCache({
		...cacheControl,
		lookup: (args) => args.serverLoader()
	})
)
export const clientLoader: ClientLoaderFunction = async (args) =>
	await cache?.get(args)
clientLoader.hydrate = true

export const headers = (({ loaderHeaders }) => {
	const cacheControl = loaderHeaders.get("Cache-Control")
	return Predicate.isString(cacheControl)
		? { "Cache-Control": cacheControl }
		: new Headers()
}) satisfies HeadersFunction

export const meta = (({ params }) => {
	return [
		{
			title: `${params.userName}'s profile`
		}
	]
}) satisfies MetaFunction<typeof loader>

function params() {
	return Schema.struct({
		userName: Schema.string
	})
}

export default function Page(): ReactNode {
	const rootData = useRawRouteLoaderData<typeof rootLoader>("root")
	const data = useRawLoaderData<typeof loader>()

	const { pathname } = useLocation()

	const follow = useFetcher<typeof userFollowAction>({
		key: `${data.user.name}-follow`
	})

	return (
		<LayoutBody>
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
							redirect: pathname
						})}`}
					>
						<ButtonText type="submit">Logout</ButtonText>
					</Form>
				)}
			</LayoutPane>
		</LayoutBody>
	)
}
