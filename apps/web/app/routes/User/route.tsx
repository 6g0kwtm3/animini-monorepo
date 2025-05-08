import { type ReactNode } from "react"
import {
	Form,
	isRouteErrorResponse,
	Outlet,
	useFetcher,
	useLocation,
	useParams,
	type ShouldRevalidateFunction,
} from "react-router"

import ReactRelay from "react-relay"
import { Icon } from "~/components/Button"

import { AppBar, AppBarTitle } from "~/components/AppBar"
import { Card } from "~/components/Card"
import { m } from "~/lib/paraglide"

import MaterialSymbolsPersonAddOutline from "~icons/material-symbols/person-add-outline"
import MaterialSymbolsPersonRemoveOutline from "~icons/material-symbols/person-remove-outline"
import type { Route } from "./+types/route"
import { User } from "./User"

import { ExtraOutlet } from "extra-outlet"
import type { routeNavUserQuery } from "~/gql/routeNavUserQuery.graphql"
import { loadQuery, usePreloadedQuery } from "~/lib/Network"
import MaterialSymbolsLogout from "~icons/material-symbols/logout"
const { graphql } = ReactRelay

export const clientLoader = (args: Route.ClientLoaderArgs) => {
	const { userName } = args.params

	const data = args.context.get(loadQuery)<routeNavUserQuery>(
		graphql`
			query routeNavUserQuery($userName: String!, $token: Boolean!)
			@raw_response_type {
				Viewer @include(if: $token) {
					id
					name
				}
				user: User(name: $userName) {
					id
					isFollowing
					name
					options {
						profileTheme
					}
					...User_user
				}
			}
		`,
		{ token: !!sessionStorage.getItem("anilist-token"), userName }
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

import * as Ariakit from "@ariakit/react"
import { button } from "~/lib/button"
import type { Route as FollowRoute } from "../UserFollow/+types/route"

import { A } from "a"
import { data as json } from "react-router"
import { LayoutBody, LayoutPane } from "~/components/Layout"
import { Tabs, TabsPanel } from "~/components/Tabs"
import { numberToString } from "~/lib/numberToString"

export default function Index({ loaderData }: Route.ComponentProps): ReactNode {
	const data = usePreloadedQuery(loaderData.routeNavUserQuery)

	if (!data.user) {
		throw json("User not found", { status: 404 })
	}

	const follow = useFetcher<FollowRoute.ComponentProps["actionData"]>({
		key: `${data.user.name}-follow`,
	})

	const params = useParams()

	const isFollow =
		follow.formData?.get("isFollowing")
		?? follow.data?.ToggleFollow.isFollowing
		?? data.user.isFollowing

	return (
		<LayoutBody
			style={data.user.options?.profileTheme ?? undefined}
			className="max-sm:pe-0 max-sm:ps-0"
		>
			<LayoutPane>
				<Card
					variant="elevated"
					className="contrast-standard theme-light contrast-more:contrast-high dark:theme-dark p-0 max-sm:contents"
				>
					<Tabs selectedId={params.typelist}>
						<div className="sticky top-0 z-50">
							<AppBar variant="large" className="sm:bg-surface-container-low">
								<AppBarTitle>
									<span>
										<A href="..">{data.user.name}</A>
										<ExtraOutlet id="title" />
									</span>
								</AppBarTitle>
								<div className="flex-1" />
								{data.Viewer?.name && data.Viewer.name !== data.user.name && (
									<follow.Form
										method="post"
										action={`/user/${numberToString(data.user.id)}/follow`}
									>
										<input
											type="hidden"
											name="isFollowing"
											value={isFollow ? "" : "true"}
											id=""
										/>

										<Icon
											type="submit"
											tooltip
											title={isFollow ? m.unfollow_button() : m.follow_button()}
										>
											{isFollow ? (
												<MaterialSymbolsPersonRemoveOutline />
											) : (
												<MaterialSymbolsPersonAddOutline />
											)}
										</Icon>
									</follow.Form>
								)}
								{data.Viewer?.name === data.user.name && <Logout />}
								<ExtraOutlet id="actions" />
							</AppBar>
						</div>

						<User user={data.user} />
						<TabsPanel tabId={params.typelist ?? "undefined"}>
							<Outlet />
						</TabsPanel>
					</Tabs>
				</Card>
			</LayoutPane>
			<ExtraOutlet id="side" />
		</LayoutBody>
	)
}
function Logout(): ReactNode {
	const { pathname } = useLocation()

	return (
		<Form
			method="post"
			action={`/logout/?${new URLSearchParams({ redirect: pathname })}`}
		>
			<Icon type="submit" tooltip title="Logout">
				<MaterialSymbolsLogout />
			</Icon>
		</Form>
	)
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps): ReactNode {
	const location = useLocation()

	// when true, this is what used to go to `CatchBoundary`
	if (isRouteErrorResponse(error)) {
		return (
			<LayoutBody>
				<LayoutPane>
					<div>
						<Ariakit.Heading>Oops</Ariakit.Heading>
						<p>Status: {error.status}</p>
						<p>{error.data}</p>
						<A href={location} className={button()}>
							Try again
						</A>
					</div>
				</LayoutPane>
			</LayoutBody>
		)
	}

	console.log({ error })

	// Don't forget to typecheck with your own logic.
	// Any value can be thrown, not just errors!
	let errorMessage = "Unknown error"
	if (error instanceof Error) {
		errorMessage = error.message || errorMessage
	}

	return (
		<LayoutBody>
			<LayoutPane>
				<Card variant="elevated">
					<Ariakit.Heading className="text-headline-md text-balance">
						Uh oh ...
					</Ariakit.Heading>
					<p className="text-headline-sm">Something went wrong.</p>
					<pre className="text-body-md overflow-auto">{errorMessage}</pre>
					<A href={location} className={button()}>
						Try again
					</A>
				</Card>
			</LayoutPane>
		</LayoutBody>
	)
}
