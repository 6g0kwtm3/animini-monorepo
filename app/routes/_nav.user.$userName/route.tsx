import {
	json,
	Link,
	Outlet,
	unstable_defineClientLoader,
	useLoaderData
} from "@remix-run/react"
import type { ComponentPropsWithRef, ReactNode } from "react"

import { client_operation } from "~/lib/client"
import { M3 } from "~/lib/components"

import { Schema } from "@effect/schema"
import ReactRelay from "react-relay"

import type { routeNavUserQuery } from "~/gql/routeNavUserQuery.graphql"
import { Ariakit } from "~/lib/ariakit"
import { Markdown, type Options } from "../_nav.feed/Markdown"

import type { routeUser_user$key } from "~/gql/routeUser_user.graphql"
import { useFragment } from "~/lib/Network"
import { route_user, route_user_list } from "~/lib/route"
import { MediaLink } from "../_nav.feed/MediaLink"
import { UserLink } from "../_nav.feed/UserLink"

const { graphql } = ReactRelay

const Params = Schema.Struct({
	userName: Schema.String,
})

export const clientLoader = unstable_defineClientLoader(async (args) => {
	const { userName } = Schema.decodeUnknownSync(Params)(args.params)

	const data = await client_operation<routeNavUserQuery>(
		graphql`
			query routeNavUserQuery($userName: String!) {
				User(name: $userName) {
					id
					about
					name
					options {
						profileTheme
					}
					...routeUser_user
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
	const data = useLoaderData<typeof clientLoader>()

	const tabs = Ariakit.useTabStore()

	return (
		<M3.LayoutBody
			style={data.user.options?.profileTheme ?? undefined}
			className="max-sm:pe-0 max-sm:ps-0"
		>
			<M3.LayoutPane variant="fixed" className="max-md:hidden">
				<User user={data.user} />
				<M3.Card className="" variant="elevated">
					<Ariakit.Heading>About me</Ariakit.Heading>
					{data.user.about && (
						<Markdown options={options}>{data.user.about}</Markdown>
					)}
				</M3.Card>
			</M3.LayoutPane>

			<Outlet
				context={{
					store: tabs,
					children: (
						<>
							<User user={data.user} className="md:hidden" />
							<M3.TabsList grow={true}>
								<M3.TabsListItem
									id="undefined"
									render={
										<Link to={route_user({ userName: data.user.name })} />
									}
								>
									Overview
								</M3.TabsListItem>
								<M3.TabsListItem
									id="animelist"
									render={
										<Link
											to={route_user_list({
												userName: data.user.name,
												typelist: "animelist",
											})}
										/>
									}
								>
									Anime List
								</M3.TabsListItem>
								<M3.TabsListItem
									id="mangalist"
									render={
										<Link
											to={route_user_list({
												userName: data.user.name,
												typelist: "mangalist",
											})}
										/>
									}
								>
									Manga List
								</M3.TabsListItem>
							</M3.TabsList>
						</>
					),
				}}
			/>
		</M3.LayoutBody>
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

const routeUser_user = graphql`
	fragment routeUser_user on User {
		id
		name
		bannerImage
		avatar {
			large
			medium
		}
	}
`

function User({
	user,
	...props
}: ComponentPropsWithRef<"div"> & { user: routeUser_user$key }) {
	const data = useFragment(routeUser_user, user)
	const src = data.avatar?.large ?? data.avatar?.medium

	return (
		<div {...props}>
			<div className="relative">
				{data.bannerImage && (
					<img src={data.bannerImage} alt="" className="w-full object-cover" />
				)}
				{data.avatar && src && (
					<img
						src={src}
						alt=""
						className="absolute bottom-0 h-full translate-y-1/2 rounded-full bg-cover object-cover"
						style={{
							backgroundImage: `url(${data.avatar.medium})`,
						}}
					/>
				)}
			</div>
			<div>
				<Ariakit.Heading className="truncate text-headline-lg">
					{data.name}
				</Ariakit.Heading>
			</div>
		</div>
	)
}
