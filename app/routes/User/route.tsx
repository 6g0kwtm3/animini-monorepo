import { type ReactNode } from "react"
import {
	Form,
	Link,
	Outlet,
	useFetcher,
	useLocation,
	useParams,
	type ShouldRevalidateFunction,
} from "react-router"

import ReactRelay from "react-relay"
import { Icon } from "~/components/Button"

import { AppBar, AppBarTitle } from "~/components"
import { M3 } from "~/lib/components"
import { m } from "~/lib/paraglide"

import MaterialSymbolsPersonAddOutline from "~icons/material-symbols/person-add-outline"
import MaterialSymbolsPersonRemoveOutline from "~icons/material-symbols/person-remove-outline"
import { User } from "../User/User"
import type { Route } from "./+types/route"

import type { routeNavUserQuery } from "~/gql/routeNavUserQuery.graphql"
import { loadQuery, usePreloadedQuery } from "~/lib/Network"
import MaterialSymbolsLogout from "~icons/material-symbols/logout"
import { ExtraOutlet } from "./ExtraOutlet"
const { graphql } = ReactRelay

export const clientLoader = (args: Route.ClientLoaderArgs) => {
	const { userName } = args.params

	const data = loadQuery<routeNavUserQuery>(
		graphql`
			query routeNavUserQuery($userName: String!) @raw_response_type {
				Viewer {
					id
					name
				}
				user: User(name: $userName) {
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

	return { routeNavUserQuery: data }
}

export const shouldRevalidate: ShouldRevalidateFunction = ({
	defaultShouldRevalidate,
	formMethod,
	currentParams,
	nextParams,
}) => {
	if (formMethod === "GET" && currentParams.userName === nextParams.userName) {
		return false
	}
	return defaultShouldRevalidate
}

import type { Route as FollowRoute } from "../UserFollow/+types/route"

export default function Index({ loaderData }: Route.ComponentProps): ReactNode {
	const data = usePreloadedQuery(...loaderData.routeNavUserQuery)

	if (!data.user) {
		throw Response.json("User not found", {
			status: 404,
		})
	}

	const follow = useFetcher<FollowRoute.ComponentProps["actionData"]>({
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
			className="max-sm:ps-0 max-sm:pe-0"
		>
			<M3.LayoutPane>
				<M3.Card
					variant="elevated"
					className="contrast-standard theme-light contrast-more:contrast-high dark:theme-dark p-0 max-sm:contents"
				>
					<M3.Tabs selectedId={params.typelist}>
						<div className="sticky top-0 z-50">
							<AppBar variant="large" className="sm:bg-surface-container-low">
								<AppBarTitle>
									<span>
										<Link to="..">{data.user.name}</Link>
										<ExtraOutlet id="title" />
									</span>
								</AppBarTitle>
								<div className="flex-1" />
								{data.Viewer?.name && data.Viewer.name !== data.user.name && (
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
								{data.Viewer?.name === data.user.name && <Logout />}
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
