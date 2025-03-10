import { Link, useFetcher, useRouteLoaderData } from "react-router"

import type { ReactNode } from "react"
import { useEffect } from "react"
import ReactRelay from "react-relay"
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemContent,
  ListItemContentSubtitle as ListItemSubtitle,
  ListItemContentTitle as ListItemTitle
} from "~/components/List"


import { route_user } from "~/lib/route"

// console.log(R)




import { Button } from "@ariakit/react"

import { Loading, Skeleton, TooltipRich, TooltipRichActions, TooltipRichContainer, TooltipRichTrigger } from "~/components"
import { Ariakit } from "~/lib/ariakit"
import * as m from '~/paraglide/messages'
const { graphql } = ReactRelay


export function UserLink(props: { userName: string; children: ReactNode }) {
	const fetcher = useFetcher<typeof userInfoLoader>({
		key: `${props.userName}-info`,
	})
	const follow = useFetcher<typeof userFollowAction>({
		key: `${props.userName}-follow`,
	})

	const store = Ariakit.useHovercardStore()

	const open = Ariakit.useStoreState(store, "open")

	useEffect(() => {
		if (open && fetcher.state === "idle" && !fetcher.data) {
			void fetcher.load(`/user/${props.userName}/info`)
		}
	}, [open, fetcher, props.userName])

	const rootData = useRouteLoaderData<typeof rootLoader>("root")

	return (
		<TooltipRich placement="top" store={store}>
			<TooltipRichTrigger
				render={
					<Link to={route_user({ userName: props.userName })}>
						{props.children}
					</Link>
				}
			/>
			<TooltipRichContainer className="not-prose text-start">
				<Loading value={fetcher.data === undefined}>
					<div className="-mx-4 -my-2">
						<List lines={"two"} className="">
							<ListItem className="hover:state-none">
								<ListItemAvatar>
									<Skeleton full>
										{fetcher.data?.User?.avatar?.large && (
											<img
												src={fetcher.data?.User.avatar.large}
												className="bg-(image:--bg) bg-cover bg-center object-cover object-center"
												style={{
													"--bg": `url(${fetcher.data?.User.avatar.medium ?? ""})`,
												}}
												loading="lazy"
												alt=""
											/>
										)}
									</Skeleton>
								</ListItemAvatar>
								<ListItemContent>
									<ListItemTitle>{props.userName}</ListItemTitle>
									<ListItemSubtitle>
										<Skeleton>
											{fetcher.data?.User?.isFollower
												? "Follower"
												: "Not follower"}
										</Skeleton>
									</ListItemSubtitle>
								</ListItemContent>
							</ListItem>
						</List>
					</div>

					<TooltipRichActions>
						{rootData?.Viewer?.name &&
							rootData?.Viewer.name !== props.userName && (
								<follow.Form
									method="post"
									action={`/user/${fetcher.data?.User?.id}/follow`}
								>
									<input
										type="hidden"
										name="isFollowing"
										value={
											(follow.formData?.get("isFollowing") ??
											follow.data?.ToggleFollow.isFollowing ??
											fetcher.data?.User?.isFollowing)
												? ""
												: "true"
										}
										id=""
									/>

									<Button type="submit" aria-disabled={!fetcher.data?.User?.id}>
										{(follow.formData?.get("isFollowing") ??
										follow.data?.ToggleFollow.isFollowing ??
										fetcher.data?.User?.isFollowing)
											? m.unfollow_button()
											: m.follow_button()}
									</Button>
								</follow.Form>
							)}
					</TooltipRichActions>
					{/* <TooltipRichSubhead>{props.children}</TooltipRichSubhead>
				<TooltipRichSupportingText>{props.children}</TooltipRichSupportingText> */}
				</Loading>
			</TooltipRichContainer>
		</TooltipRich>
	)
}