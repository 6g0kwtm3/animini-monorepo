import { Suspense, type ReactNode } from "react"
import ReactRelay from "react-relay"
import {
	isRouteErrorResponse,
	useLocation,
	type ShouldRevalidateFunction,
} from "react-router"

import type { Route } from "./+types/route"

import * as Ariakit from "@ariakit/react"
import type { routeNavUserIndexQuery } from "~/gql/routeNavUserIndexQuery.graphql"
import { M3 } from "~/lib/components"

import { Markdown } from "markdown"

import { ExtraOutlets } from "extra-outlet"
import { fetchQuery, loadQuery } from "~/lib/Network"

const { graphql } = ReactRelay

import * as Sentry from "@sentry/react"
import { A } from "a"
import { data as json } from "react-router"
import { Card } from "~/components"
import { List } from "~/components/List"
import type { UserActivitiesQuery as UserActivitiesQueryOperation } from "~/gql/UserActivitiesQuery.graphql"
import { button } from "~/lib/button"
import { options } from "../Home/options"
import { UserActivities, UserActivitiesQuery } from "./UserActivities"
export const clientLoader = async (args: Route.ClientLoaderArgs) => {
	const { userName } = args.params

	const data = await fetchQuery<routeNavUserIndexQuery>(
		graphql`
			query routeNavUserIndexQuery($userName: String!) @raw_response_type {
				User(name: $userName) {
					id
					about
				}
			}
		`,
		{ userName }
	)

	if (!data?.User) {
		throw json("User not found", { status: 404 })
	}

	return {
		user: data.User,
		UserActivitiesQuery: args.context.get(
			loadQuery
		)<UserActivitiesQueryOperation>(UserActivitiesQuery, {
			userId: data.User.id,
		}),
	}
}

export const meta = (({ params }) => {
	return [{ title: `${params.userName}'s profile` }]
}) satisfies Route.MetaFunction

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

function SidePanel({ loaderData: data }: Route.ComponentProps): ReactNode {
	return (
		<M3.LayoutPane variant={"fixed"} className="max-xl:hidden">
			<M3.Card
				variant="elevated"
				className="contrast-standard theme-light contrast-more:contrast-high dark:theme-dark"
			>
				<Ariakit.Heading>About me</Ariakit.Heading>
				{data.user.about ? (
					<div className="prose md:prose-lg lg:prose-xl dark:prose-invert prose-img:inline prose-img:rounded-md prose-video:inline prose-video:rounded-md max-w-full overflow-x-auto">
						<Markdown options={options}>{data.user.about}</Markdown>
					</div>
				) : (
					"Empty about"
				)}
			</M3.Card>
		</M3.LayoutPane>
	)
}

export default function UserOverview(props: Route.ComponentProps): ReactNode {
	return (
		<ExtraOutlets
			side={<SidePanel {...props} />}
			title=" | Overview"
			actions={<></>}
		>
			<Sentry.ErrorBoundary fallback={<>Error</>}>
				<Suspense fallback="Loading...">
					<List>
						<UserActivities
							userId={props.loaderData.user.id}
							queryRef={props.loaderData.UserActivitiesQuery}
						></UserActivities>
					</List>
				</Suspense>
			</Sentry.ErrorBoundary>
		</ExtraOutlets>
	)
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps): ReactNode {
	const location = useLocation()

	// when true, this is what used to go to `CatchBoundary`
	if (isRouteErrorResponse(error)) {
		return (
			<ExtraOutlets>
				<div>
					<Ariakit.Heading>Oops</Ariakit.Heading>
					<p>Status: {error.status}</p>
					<p>{error.data}</p>
					<A href={location} className={button()}>
						Try again
					</A>
				</div>
			</ExtraOutlets>
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
		<ExtraOutlets>
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
		</ExtraOutlets>
	)
}
