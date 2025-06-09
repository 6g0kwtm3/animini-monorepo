import { useFetcher, useRouteLoaderData } from "react-router"

import { ErrorBoundary } from "@sentry/react"
import type { ReactNode } from "react"
import { Suspense } from "react"
import ReactRelay, { useLazyLoadQuery } from "react-relay"
import {
	List,
	ListItem,
	ListItemAvatar,
	ListItemContent,
	ListItemContentSubtitle as ListItemSubtitle,
	ListItemContentTitle as ListItemTitle,
} from "~/components/List"

import { route_user } from "~/lib/route"

// console.log(R)

import {
	TooltipDisclosure,
	TooltipRich,
	TooltipRichActions,
	TooltipRichContainer,
	TooltipRichTrigger,
} from "~/components/Tooltip"

import { Button } from "~/components/Button"
import { type clientLoader as rootLoader } from "~/root"

import type { UserLinkCardQuery } from "~/gql/UserLinkCardQuery.graphql"
import { numberToString } from "~/lib/numberToString"
import { m } from "~/lib/paraglide"
import type { clientAction as userFollowAction } from "../UserFollow/route"
import { A } from "a"
const { graphql } = ReactRelay

export function UserLink(props: { userName: string; children: ReactNode }) {
	return (
		<TooltipRich placement="top">
			<TooltipRichTrigger
				render={<A href={route_user({ userName: props.userName })}></A>}
			>
				{props.children}
			</TooltipRichTrigger>
			<TooltipDisclosure>More about {props.userName}</TooltipDisclosure>

			<ErrorBoundary>
				<Suspense>
					<TooltipRichContainer className="text-start" unmountOnHide>
						<UserCard userName={props.userName}></UserCard>
					</TooltipRichContainer>
				</Suspense>
			</ErrorBoundary>
		</TooltipRich>
	)
}

function UserCard(props: { userName: string }) {
	const data = useLazyLoadQuery<UserLinkCardQuery>(
		graphql`
			query UserLinkCardQuery($userName: String!) {
				User(name: $userName) {
					id
					avatar {
						medium
						large
					}
					isFollower
					isFollowing
				}
			}
		`,
		{ userName: props.userName }
	)

	const rootData = useRouteLoaderData<typeof rootLoader>("root")
	const follow = useFetcher<typeof userFollowAction>({
		key: `${props.userName}-follow`,
	})

	return (
		data.User && (
			<>
				<div className="-mx-4 -my-2">
					<List className="">
						<ListItem className="hover:state-none">
							<ListItemAvatar>
								{data.User.avatar?.large && (
									<img
										src={data.User.avatar.large}
										className="bg-(image:--bg) bg-cover bg-center object-cover object-center"
										style={{ "--bg": `url(${data.User.avatar.medium ?? ""})` }}
										loading="lazy"
										alt=""
									/>
								)}
							</ListItemAvatar>
							<ListItemContent>
								<ListItemTitle>{props.userName}</ListItemTitle>
								<ListItemSubtitle>
									{data.User.isFollower ? "Follower" : "Not follower"}
								</ListItemSubtitle>
							</ListItemContent>
						</ListItem>
					</List>
				</div>

				<TooltipRichActions>
					{rootData?.Viewer?.name
						&& rootData.Viewer.name !== props.userName && (
							<follow.Form
								method="post"
								action={`/follow/${numberToString(data.User.id)}`}
							>
								<input
									type="hidden"
									name="isFollowing"
									value={
										(follow.formData?.get("isFollowing")
										?? follow.data?.ToggleFollow.isFollowing
										?? data.User.isFollowing)
											? ""
											: "true"
									}
									id=""
								/>

								<Button type="submit" aria-disabled={!data.User.id}>
									{(follow.formData?.get("isFollowing")
									?? follow.data?.ToggleFollow.isFollowing
									?? data.User.isFollowing)
										? m.unfollow_button()
										: m.follow_button()}
								</Button>
							</follow.Form>
						)}
				</TooltipRichActions>
				{/* <TooltipRichSubhead>{props.children}</TooltipRichSubhead>
			<TooltipRichSupportingText>{props.children}</TooltipRichSupportingText> */}
			</>
		)
	)
}
