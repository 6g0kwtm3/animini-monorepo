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
			<div className="" {...props}>
				<div className="grid overflow-hidden rounded-xl">
					{data.bannerImage && (
						<img
							src={data.bannerImage}
							alt=""
							className="col-start-1 row-start-1 object-cover"
						/>
					)}
					{data.avatar && src && (
						<img
							src={src}
							alt=""
							className="col-start-1 row-start-1 self-end bg-cover object-cover"
							style={{
								backgroundImage: `url(${data.avatar.medium})`,
							}}
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
					render={<M3.Link to={route_user({ userName: data.name })} />}
				>
					Overview
				</M3.TabsListItem>
				<M3.TabsListItem
					id="animelist"
					render={
						<M3.Link
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
						<M3.Link
							to={route_user_list({
								userName: data.name,
								typelist: "mangalist",
							})}
						/>
					}
				>
					Manga List
				</M3.TabsListItem>
				<M3.TabsListItem id="favorites" render={<M3.Link to={""} />}>
					Favorites
				</M3.TabsListItem>
				<M3.TabsListItem id="stats" render={<M3.Link to={""} />}>Stats</M3.TabsListItem>
				<M3.TabsListItem id="social" render={<M3.Link to={""} />}>Social</M3.TabsListItem>
				<M3.TabsListItem id="reviews" render={<M3.Link to={""} />}>Reviews</M3.TabsListItem>
				<M3.TabsListItem id="submissions" render={<M3.Link to={""} />}>
					Submissions
				</M3.TabsListItem>
			</M3.TabsList>
		</>
	)
}
