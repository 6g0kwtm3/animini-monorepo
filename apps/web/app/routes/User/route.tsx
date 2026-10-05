import { AppBar, AppBarTitle } from "@animedes/components/AppBar"
import { Breadcrumb, BreadcrumbItem } from "@animedes/components/Breadcrumb"
import { Icon } from "@animedes/components/Button"
import { button } from "@animedes/components/button.styles"
import { Card } from "@animedes/components/Card"
import { LayoutBody, LayoutPane } from "@animedes/components/Layout"
import { Tabs, TabsPanel } from "@animedes/components/Tabs"
import { ExtraOutlet } from "extra-outlet"
import { type ReactNode } from "react"
import ReactRelay from "react-relay"
import {
	Form,
	isRouteErrorResponse,
	Outlet,
	useFetcher,
	useLocation,
	useParams,
} from "react-router"
import { loadQuery, usePreloadedQuery } from "~/lib/Network"
import { m } from "~/lib/paraglide"
import MaterialSymbolsLogout from "~icons/material-symbols/logout"
import MaterialSymbolsPersonAddOutline from "~icons/material-symbols/person-add-outline"
import MaterialSymbolsPersonRemoveOutline from "~icons/material-symbols/person-remove-outline"

import { User } from "./User"

import type { Route } from "./+types/route"
import type { routeNavUserQuery } from "~/gql/routeNavUserQuery.graphql"
const { graphql } = ReactRelay

export const clientLoader = (args: Route.ClientLoaderArgs) => {
	const { userName } = args.params

	const data = args.context.get(loadQuery)<routeNavUserQuery>(
		graphql`
			query routeNavUserQuery($userName: String!, $token: Boolean!)
			@raw_response_type
			@throwOnFieldError {
				Viewer @include(if: $token) {
					id
					name
				}
				user: User(name: $userName) {
					id
					isFollowing
					name
					options {
						profileTheme @catch(to: NULL)
					}
					...User_user @alias
				}
			}
		`,
		{ token: !!sessionStorage.getItem("anilist-token"), userName }
	)

	return { routeNavUserQuery: data }
}

import { A } from "@anitrove/a"
import * as design from "@anitrove/design"
import { mergeStyles, precompileStyles } from "@anitrove/unstyled"
import * as Ariakit from "@ariakit/react"
import { data as json } from "react-router"

import type { Route as FollowRoute } from "../UserFollow/+types/route"

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
			style={mergeStyles(
				data.user.options?.profileTheme ?? undefined,
				precompileStyles(design.utilities.paddingX({ [design.media.maxSm]: 0 }))
			)}
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
									<Breadcrumb>
										<BreadcrumbItem href=".">{data.user.name}</BreadcrumbItem>
										<ExtraOutlet id="title" />
									</Breadcrumb>
								</AppBarTitle>
								<div className="flex-1" />
								{data.Viewer?.name && data.Viewer.name !== data.user.name ? (
									<follow.Form method="post" action={`/follow/${data.user.id}`}>
										<input
											type="hidden"
											name="isFollowing"
											value={isFollow ? "" : "true"}
											id=""
										/>

										<Icon
											type="submit"
											label={{
												kind: "ariakit-tooltip",
												value: isFollow
													? m.unfollow_button()
													: m.follow_button(),
											}}
										>
											{isFollow ? (
												<MaterialSymbolsPersonRemoveOutline />
											) : (
												<MaterialSymbolsPersonAddOutline />
											)}
										</Icon>
									</follow.Form>
								) : null}
								{data.Viewer?.name === data.user.name && <Logout />}
								<ExtraOutlet id="actions" />
							</AppBar>
						</div>

						<User user={data.user.User_user} />
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
			<Icon type="submit" label={{ kind: "ariakit-tooltip", value: "Logout" }}>
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
	if (Error.isError(error)) {
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
