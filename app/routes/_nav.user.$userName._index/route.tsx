import { Schema } from "@effect/schema"
import type { HeadersFunction, MetaFunction } from "@remix-run/cloudflare"
import { json, unstable_defineLoader } from "@remix-run/cloudflare"

import {
	Form,
	Link,
	unstable_defineClientLoader,
	useFetcher,
	useLocation
} from "@remix-run/react"
import { Predicate } from "effect"
import type { ReactNode } from "react"
import { Button, Button as ButtonText } from "~/components/Button"
import { LayoutBody, LayoutPane } from "~/components/Layout"
import { graphql } from "~/gql"
import { button } from "~/lib/button"
import { client_operation, type AnyLoaderFunctionArgs } from "~/lib/client"
import { useRawLoaderData, useRawRouteLoaderData } from "~/lib/data"
import { getCacheControl } from "~/lib/getCacheControl"
import type { clientLoader as rootLoader } from "~/root"

import { clientOnly$ } from "vite-env-only"
import { client, createGetInitialData, persister } from "~/lib/cache.client"
import { m } from "~/lib/paraglide"
import type { action as userFollowAction } from "../user.$userId.follow/route"

export const loader = unstable_defineLoader(async (args) => {
	args.response.headers.append("Cache-Control", getCacheControl(cacheControl))

	return userLoader(args)
})

const cacheControl = {
	maxAge: 15,
	staleWhileRevalidate: 45,
	private: true
}

const isInitialRequest = clientOnly$(createGetInitialData())
export const clientLoader = unstable_defineClientLoader(async (args) => {
	return client.ensureQueryData({
		revalidateIfStale: true,
		persister,
		queryKey: ["_nav.user", args.params.userName, "_index"],
		queryFn: async () => userLoader(args),
		initialData:
			isInitialRequest?.() && (await args.serverLoader<typeof loader>())
	})
})
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

async function userLoader(args: AnyLoaderFunctionArgs) {
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
		throw json("User not found", {
			status: 404
		})
	}

	return { user: data.User }
}

function params() {
	return Schema.Struct({
		userName: Schema.String
	})
}

export default function Page(): ReactNode {
	const rootData = useRawRouteLoaderData<typeof rootLoader>("root")
	const data = useRawLoaderData<typeof clientLoader>()

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
