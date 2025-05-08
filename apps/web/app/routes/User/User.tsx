import type { ComponentProps, ReactNode } from "react"

import { useFragment } from "~/lib/Network"
import { route_user, route_user_list } from "~/lib/route"

import { A } from "a"
import ReactRelay from "react-relay"
import { TabsList, TabsListItem } from "~/components/Tabs"
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

interface UserProps extends ComponentProps<"div"> {
	user: User_user$key
}

export function User({ user, ...props }: UserProps): ReactNode {
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
							style={
								data.avatar.medium
									? { backgroundImage: `url(${data.avatar.medium})` }
									: undefined
							}
						/>
					)}
				</div>
				{/* <div>
				<Ariakit.Heading className="truncate text-headline-lg">
					{data.name}
				</Ariakit.Heading>
			</div> */}
			</div>
			<TabsList className="md:tabs-grow">
				<TabsListItem
					id="undefined"
					render={<A href={route_user({ userName: data.name })}></A>}
				>
					Overview
				</TabsListItem>
				<TabsListItem
					id="animelist"
					render={
						<A
							href={route_user_list({
								userName: data.name,
								typelist: "animelist",
							})}
						></A>
					}
				>
					Anime List
				</TabsListItem>
				<TabsListItem
					id="mangalist"
					render={
						<A
							href={route_user_list({
								userName: data.name,
								typelist: "mangalist",
							})}
						></A>
					}
				>
					Manga List
				</TabsListItem>
				<TabsListItem id="favorites" render={<A href={"favorites"}></A>}>
					Favorites
				</TabsListItem>
				<TabsListItem id="stats" render={<A href={"stats"}></A>}>
					Stats
				</TabsListItem>
				<TabsListItem id="social" render={<A href={"social"}></A>}>
					Social
				</TabsListItem>
				<TabsListItem id="reviews" render={<A href={"reviews"}></A>}>
					Reviews
				</TabsListItem>
				<TabsListItem id="submissions" render={<A href={"submissions"}></A>}>
					Submissions
				</TabsListItem>
			</TabsList>
		</>
	)
}
