import { Schema } from "@effect/schema"
import { json } from "@remix-run/node"
import {
	Form,
	Link,
	Outlet,
	unstable_defineClientLoader,
	useFetcher,
	useLocation,
	useParams,
	useRouteLoaderData,
} from "@remix-run/react"
import { type ReactNode } from "react"

import ReactRelay from "react-relay"
import { Icon } from "~/components/Button"

import { client_operation } from "~/lib/client"
import { useRawLoaderData } from "~/lib/data"
import { RootQuery, type clientLoader as rootLoader } from "~/root"

import { AppBar, AppBarTitle } from "~/components"
import { M3 } from "~/lib/components"
import { m } from "~/lib/paraglide"
import type { clientAction as userFollowAction } from "../user.$userId.follow/route"

import MaterialSymbolsPersonAddOutline from "~icons/material-symbols/person-add-outline"
import MaterialSymbolsPersonRemoveOutline from "~icons/material-symbols/person-remove-outline"
import { User } from "../_nav.user.$userName/User"

import type { routeNavUserQuery } from "~/gql/routeNavUserQuery.graphql"
import { usePreloadedQuery } from "~/lib/Network"
import MaterialSymbolsLogout from "~icons/material-symbols/logout"
import { ExtraOutlet } from "./ExtraOutlet"
const { graphql } = ReactRelay

const Params = Schema.Struct({
	userName: Schema.String,
})

export const clientLoader = unstable_defineClientLoader(async (args) => {
	const { userName } = Schema.decodeUnknownSync(Params)(args.params)

	const data = await client_operation<routeNavUserQuery>(
		graphql`
			query routeNavUserQuery($userName: String!) @raw_response_type {
				User(name: $userName) {
					id
					isFollowing
					about
					name
					options {
						profileTheme
					}
					...User_user
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

export default function Page(): ReactNode {
	const root = usePreloadedQuery(
		RootQuery,
		useRouteLoaderData<typeof rootLoader>("root")!.query
	)
	const data = useRawLoaderData<typeof clientLoader>()

	const follow = useFetcher<typeof userFollowAction>({
		key: `${data.user.name}-follow`,
	})

	const params = useParams()

	const isFollow =
		follow.formData?.get("isFollowing") ??
		follow.data?.ToggleFollow.isFollowing ??
		data.user.isFollowing
		
	return (
		<M3.LayoutBody
			style={data.user.options?.profileTheme ?? undefined}
			className="max-sm:pe-0 max-sm:ps-0"
		>
			<M3.LayoutPane>
				<M3.Card
					variant="elevated"
					className="p-0 contrast-standard theme-light contrast-more:contrast-high max-sm:contents dark:theme-dark"
				>
					<M3.Tabs selectedId={params.typelist ?? "undefined"}>
						<div className="sticky top-0 z-50">
							<AppBar variant="large" className="sm:bg-surface-container-low">
								<AppBarTitle>
									<span>
										<Link to="..">{data.user.name}</Link>
										<ExtraOutlet id="title" />
									</span>
								</AppBarTitle>
								<div className="flex-1" />
								{root.Viewer?.name && root.Viewer.name !== data.user.name && (
									<follow.Form
										method="post"
										action={`/user/${data.user.id}/follow`}
									>
										<input
											type="hidden"
											name="isFollowing"
											value={isFollow ? "" : "true"}
											id=""
										/>

										<M3.Icon
											type="submit"
											label={isFollow ? m.unfollow_button() : m.follow_button()}
										>
											{isFollow ? (
												<MaterialSymbolsPersonRemoveOutline />
											) : (
												<MaterialSymbolsPersonAddOutline />
											)}
										</M3.Icon>
									</follow.Form>
								)}
								{root.Viewer?.name === data.user.name && <Logout />}
								<ExtraOutlet id="actions" />
							</AppBar>
						</div>

						<User user={data.user} />
						<M3.TabsPanel tabId={params.typelist ?? "undefined"}>
							<Outlet />
						</M3.TabsPanel>
					</M3.Tabs>
				</M3.Card>
			</M3.LayoutPane>
			<ExtraOutlet id="side" />
		</M3.LayoutBody>
	)
}
function Logout(): ReactNode {
	const { pathname } = useLocation()

	return (
		<Form
			method="post"
			action={`/logout/?${new URLSearchParams({
				redirect: pathname,
			})}`}
		>
			<Icon type="submit" label="Logout">
				<span className="sr-only">Logout</span>
				<MaterialSymbolsLogout />
			</Icon>
		</Form>
	)
}
