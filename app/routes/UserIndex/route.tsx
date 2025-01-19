import type { MetaFunction } from "react-router"

import type { ReactNode } from "react"
import ReactRelay from "react-relay"
import { type ShouldRevalidateFunction } from "react-router"

import type { Route } from "./+types/route"

import type { routeNavUserIndexQuery } from "~/gql/routeNavUserIndexQuery.graphql"
import { Ariakit } from "~/lib/ariakit"
import { M3 } from "~/lib/components"

import { Markdown, type Options } from "../Home/Markdown"

import { fetchQuery } from "~/lib/Network"
import { MediaLink } from "../Home/MediaLink"
import { UserLink } from "../Home/UserLink"
import { ExtraOutlets } from "../User/ExtraOutlet"

const { graphql } = ReactRelay

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

	if (!data.User) {
		throw Response.json("User not found", {
			status: 404,
		})
	}

	return { user: data.User }
}

export const meta = (({ params }) => {
	return [
		{
			title: `${params.userName}'s profile`,
		},
	]
}) satisfies MetaFunction<typeof clientLoader>

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
				{data.user.about && (
					<Markdown
						className="prose md:prose-lg lg:prose-xl dark:prose-invert prose-img:inline prose-img:rounded-md prose-video:inline prose-video:rounded-md max-w-full overflow-x-auto"
						options={options}
					>
						{data.user.about}
					</Markdown>
				)}
			</M3.Card>
		</M3.LayoutPane>
	)
}

export default function SidePanelRoute(props: Route.ComponentProps): ReactNode {
	return (
		<ExtraOutlets
			side={<SidePanel {...props} />}
			title=" | Overview"
			actions={<></>}
		>
			<>{JSON.stringify(props.loaderData)}</>
		</ExtraOutlets>
	)
}

const options = {
	replace: {
		center(props) {
			return <center {...props} />
		},
		p(props) {
			return <div {...props} />
		},
		a(props) {
			if (!props.href?.trim()) {
				return <span className="text-primary">{props.children}</span>
			}

			// @ts-expect-error dataset properties are not typed
			if (props.className === "media-link" && props["data-id"]) {
				// @ts-expect-error dataset properties are not typed
				return <MediaLink mediaId={props["data-id"]} />
			}

			// @ts-expect-error dataset properties are not typed
			if (props["data-user-name"]) {
				return (
					// @ts-expect-error dataset properties are not typed
					<UserLink userName={props["data-user-name"]}>
						{props.children}
					</UserLink>
				)
			}

			return (
				<a {...props} rel="noopener noreferrer" target="_blank">
					{props.children}
				</a>
			)
		},
	},
} satisfies Options
