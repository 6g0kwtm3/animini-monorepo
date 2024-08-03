import { Link } from "@remix-run/react"
import type { ComponentProps, ReactNode } from "react"

import { M3 } from "~/lib/components"
import { useFragment } from "~/lib/Network"
import { route_user, route_user_list } from "~/lib/route"

import ReactRelay from "react-relay"
import type { User_user$key } from "~/gql/User_user.graphql"

const { graphql } = ReactRelay

const User_user = graphql`
	fragment User_user on User {
		id
		name
		bannerImage
		avatar {
			large
			medium
		}
	}
`

export function User({
	user,
	...props
}: ComponentProps<"div"> & { user: User_user$key }): ReactNode {
	const data = useFragment(User_user, user)
	const src = data.avatar?.large ?? data.avatar?.medium

	return (
		<>
			<div className="z-10" {...props}>
				<div className="relative">
					{data.avatar && src && (
						<img
							src={src}
							alt=""
							className="bg-cover object-cover"
							style={{
								backgroundImage: `url(${data.avatar.medium})`,
							}}
						/>
					)}
					{data.bannerImage && (
						<img
							src={data.bannerImage}
							alt=""
							className="absolute inset-0 -z-50 h-full w-full rounded-xl object-cover"
						/>
					)}
				</div>
				{/* <div>
				<Ariakit.Heading className="truncate text-headline-lg">
					{data.name}
				</Ariakit.Heading>
			</div> */}
			</div>
			<M3.TabsList
				grow={{
					initial: false,
					md: true,
				}}
			>
				<M3.TabsListItem
					id="undefined"
					render={
						<Link
							unstable_viewTransition
							to={route_user({ userName: data.name })}
						/>
					}
				>
					Overview
				</M3.TabsListItem>
				<M3.TabsListItem
					id="animelist"
					render={
						<Link
							unstable_viewTransition
							to={route_user_list({
								userName: data.name,
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
							unstable_viewTransition
							to={route_user_list({
								userName: data.name,
								typelist: "mangalist",
							})}
						/>
					}
				>
					Manga List
				</M3.TabsListItem>
				<M3.TabsListItem render={<Link unstable_viewTransition to={""} />}>
					Favorites
				</M3.TabsListItem>
				<M3.TabsListItem render={<Link unstable_viewTransition to={""} />}>
					Stats
				</M3.TabsListItem>
				<M3.TabsListItem render={<Link unstable_viewTransition to={""} />}>
					Social
				</M3.TabsListItem>
				<M3.TabsListItem render={<Link unstable_viewTransition to={""} />}>
					Reviews
				</M3.TabsListItem>
				<M3.TabsListItem render={<Link unstable_viewTransition to={""} />}>
					Submissions
				</M3.TabsListItem>
			</M3.TabsList>
		</>
	)
}
