import type { MetaFunction } from "@remix-run/node"
import { json } from "@remix-run/node"

import { unstable_defineClientLoader, useLoaderData } from "@remix-run/react"
import type { ReactNode } from "react"
import ReactRelay from "react-relay"

import { client_operation } from "~/lib/client"
import { useRawLoaderData } from "~/lib/data"

import type { routeNavUserIndexQuery } from "~/gql/routeNavUserIndexQuery.graphql"
import { Ariakit } from "~/lib/ariakit"
import { M3 } from "~/lib/components"

import { Markdown, type Options } from "../_nav.feed/Markdown"

import { MediaLink } from "../_nav.feed/MediaLink"
import { UserLink } from "../_nav.feed/UserLink"
import { ExtraOutlets } from "../_nav.user.$userName/ExtraOutlet"
import { Schema } from "@effect/schema"

const { graphql } = ReactRelay

export const clientLoader = unstable_defineClientLoader(async (args) => {
	const { userName } = Schema.decodeUnknownSync(params())(args.params)

	const data = await client_operation<routeNavUserIndexQuery>(
		graphql`
			query routeNavUserIndexQuery($userName: String!) {
				User(name: $userName) {
					about
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

function SidePanel(): ReactNode {
	const data = useLoaderData<typeof clientLoader>()

	return (
		<M3.LayoutPane variant={"fixed"} className="max-xl:hidden">
			<M3.Card
				variant="elevated"
				className="contrast-standard theme-light contrast-more:contrast-high dark:theme-dark"
			>
				<Ariakit.Heading>About me</Ariakit.Heading>
				{data.user.about && (
					<Markdown options={options}>{data.user.about}</Markdown>
				)}
			</M3.Card>
		</M3.LayoutPane>
	)
}

function params() {
	return Schema.Struct({
		userName: Schema.String,
	})
}

export default function Route(): ReactNode {
	const data = useRawLoaderData<typeof clientLoader>()

	return (
		<ExtraOutlets side={<SidePanel />} title=" | Overview" actions={<></>}>
			<>{JSON.stringify(data)}</>
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

			// @ts-ignore
			if (props.className === "media-link" && props["data-id"]) {
				// @ts-ignore
				return <MediaLink mediaId={props["data-id"]} />
			}

			// @ts-ignore
			if (props["data-user-name"]) {
				return (
					// @ts-ignore
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
